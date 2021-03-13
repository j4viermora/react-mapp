import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { token } from '../constants/constants';
import { v4 as uuid } from 'uuid';

mapboxgl.accessToken = token;


export const useMapBox = ( initialPoint ) => {
    
    //keep ref to marker

    
    const [ coords, setCoords ] = useState(initialPoint);
   
    const mapaDiv =useRef();
    const setRef = useCallback( (nodo) => {
        mapaDiv.current = nodo 
    }, [] )
    
    const mapa = useRef();

    useEffect( () => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current ,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ initialPoint.lng, initialPoint.lat ],
            zoom: initialPoint.zoom, 
            });
    
           mapa.current = map 
    
    }, [ initialPoint ] );
    //when to move map
    useEffect(() => {
        //verficamos que mapa no sea undefined para poder continuar
        mapa.current?.on( 'move', ()=> {
           const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed( 4 ),
                lat: lat.toFixed( 4 ),
                zoom: mapa.current.getZoom().toFixed(2)
            })    
        
        });
        return () => {
            mapa.current?.off('move');
        }
    }, [mapa]);

    useEffect( () => {

        mapa.current?.on('click', ( evt ) => {

            const { lat, lng } = evt.lngLat;

            const marker = new mapboxgl.Marker();
            marker.id = uuid(); // si el marcador ya tiene id 

            marker
                .setLngLat( [ lng, lat ] )
                .addTo( mapa.current )
                .setDraggable( true );
            

        });

    }, [] );


    return {
        coords,
        setRef
    }

}
