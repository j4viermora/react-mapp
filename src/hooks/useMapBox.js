import { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { token } from "../constants/constants";
import { v4 as uuid } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken = token;

export const useMapBox = (initialPoint) => {
  //keep ref to marker
  const mapaDiv = useRef();
  const markers = useRef({});
  const mapa = useRef();

  const [coords, setCoords] = useState(initialPoint);

  const setRef = useCallback((nodo) => {
    mapaDiv.current = nodo;
  }, []);
  //Observables from rxjs
  const moveMarker = useRef( new Subject() );
  const newMarker = useRef(new Subject());
  //Creacion del mapa
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initialPoint.lng, initialPoint.lat],
      zoom: initialPoint.zoom,
    });
    mapa.current = map;
  }, [initialPoint]);

  //function to add marker
  const addMarker = useCallback((evt, id) => {
    const { lat, lng } = evt.lngLat || evt;
    const marker = new mapboxgl.Marker();
    marker.id = id ?? uuid();
    marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);
    markers.current[marker.id] = marker;
    //todo if market have id not emit
    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lng,
        lat,
      });
    }
    //listen move marker
    marker.on("drag", function ({ target }) {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      moveMarker.current.next({ id, lng, lat } );
    });
   
  }, []);

  // funcion para actualizar la ubicacion del marcador

  const  updatePosition = useCallback( ( { id, lng, lat } ) => {
   
    console.log(id, lng , lat ) 
    markers.current[id].setLngLat([ lng, lat ]);
  }, [])

  //when to move map
  useEffect(() => {
    //verficamos que mapa no sea undefined para poder continuar
    mapa.current?.on("move", () => {
      const { lng, lat } = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2),
      });
    });
    return () => {
      mapa.current?.off("move");
    };
  }, [mapa]);

  useEffect(() => {
    //simple code
    mapa.current?.on("click", addMarker);
 
  }, [addMarker]);

  return {
    coords,
    setRef,
    addMarker,
    markers,
    newMarker$: newMarker.current,
    moveMarker$: moveMarker.current,
    updatePosition
  };
};
