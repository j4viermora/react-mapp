import React, { useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import './MapView.css'
import { token } from '../constants/constants'
import { useMapBox } from '../hooks/useMapBox';


mapboxgl.accessToken = token;



export const MapView = () => {

    const mapaDiv = useRef()
    const mapa  = useRef()
    const { coords } = useMapBox( mapa, mapaDiv )



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
