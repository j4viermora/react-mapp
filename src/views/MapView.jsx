import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import './MapView.css'
import { token } from '../constants/constants'


mapboxgl.accessToken = token;
const initialPoint = {
    lng: -64.7023,
    lat: 10.2047,
    zoom: 13.83
}


export const MapView = () => {
 
    const mapaDiv = useRef()

    // const [ mapa, setMapa ] = useState()
    const [ coords, setCoords ] = useState( initialPoint )
    
    const mapa  = useRef()

    useEffect( () => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current ,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ initialPoint.lng, initialPoint.lat ],
            zoom: initialPoint.zoom, 
            });

           mapa.current = map 

    }, [] )
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
    }, [])



    return (
        <>
            <div className="info-windows" >
                lng: { coords.lng } | lat: { coords.lat } | zoom: { coords.zoom }
            </div>

            <div
            ref={ mapaDiv }
            className="mapContainer"
            />

        </>
    )
}
