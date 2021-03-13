import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { token } from '../constants/constants';
import { v4 as uuid } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = token;


export const useMapBox = ( initialPoint ) => {
    
    //keep ref to marker

    const markers = useRef({})
    
    const [ coords, setCoords ] = useState(initialPoint);
   
    const mapaDiv =useRef();
    const setRef = useCallback( (nodo) => {
        mapaDiv.current = nodo 
    }, [] )
    
    const mapa = useRef();

    //Observables from rxjs 

    const moveMarker = useRef( new Subject() );
    const newMarker = useRef( new Subject() );



    //function to add marker

    const addMarker = useCallback( ({ lngLat }) => {

        const { lat, lng } = lngLat;

        const marker = new mapboxgl.Marker();
        marker.id = uuid(); // si el marcador ya tiene id 

        marker
            .setLngLat( [ lng, lat ] )
            .addTo( mapa.current )
            .setDraggable( true );
        markers.current[ marker.id ] = marker;

        //todo if market have id not emit

        newMarker.current.next( {
            id: marker.id ,
            lng,
            lat
        } )


        //listen move marker 
        marker.on( 'drag', function({ target } ){
            const { id } = target;
            const { lng, lat } = target.getLngLat();
            
            // moveMarker.current.next({
            //     id,
            //     lng,
            //     lat
            // })

             moveMarker.current.next( id )

        } );
        //emit change marker



        // in case we want only get lng and lat when, start and end drag
        // marker.on( 'dragstart', function({ target } ){
        //     const { id } = target;
        //     const { lng, lat } = target.getLngLat();
        //     console.log(lng, lat, 'start')
        // } );
        // marker.on( 'dragend', function({ target } ){
        //     const { id } = target;
        //     const { lng, lat } = target.getLngLat();
        //     console.log(lng, lat, 'end')
        // } );


    } ,[] );



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

        //simple code 

        mapa.current?.on( 'click', addMarker )

        // mapa.current?.on('click', ( evt ) => {

        //    addMarker( evt )

        // });

    }, [addMarker] );


    return {
        coords,
        setRef,
        addMarker,
        markers,
        newMarker$ : newMarker.current,
        moveMarker$ : moveMarker.current,
    }

}
