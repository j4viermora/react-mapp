import React  from 'react'
import mapboxgl from 'mapbox-gl'
import './MapView.css'
import { token } from '../constants/constants'
import { useMapBox } from '../hooks/useMapBox';


mapboxgl.accessToken = token;

const initialPoint = {
    lng: -64.7023,
    lat: 10.2047,
    zoom: 13.83
}


export const MapView = () => {

    // const mapaDiv = useRef()
    // const mapa  = useRef()
    const { coords , setRef  } = useMapBox( initialPoint )



    return (
        <>
            <div className="info-windows" >
                lng: { coords.lng } | lat: { coords.lat } | zoom: { coords.zoom }
            </div>

            <div
            ref={ setRef }
            className="mapContainer"
            />

        </>
    )
}
