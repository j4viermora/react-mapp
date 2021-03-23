import React, { useContext, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./MapView.css";
import { token } from "../constants/constants";
import { useMapBox } from "../hooks/useMapBox";
import { SocketContext } from "../context/socketContext";

mapboxgl.accessToken = token;

const initialPoint = {
  lng: -64.7023,
  lat: 10.2047,
  zoom: 13.83,
};

export const MapView = () => {
  const { socket } = useContext(SocketContext);
  const {
    coords,
    setRef,
    newMarker$,
    moveMarker$,
    addMarker,
    updatePosition,
  } = useMapBox(initialPoint);


  //Marcadores activos
  useEffect(
    function () {
      socket.on("marcadores-activos", (marcadoresActivos) => {   
        for (const i of Object.keys(marcadoresActivos)) {
          addMarker( marcadoresActivos[i], i )
        }
      });
    },
    [socket, addMarker]
  );
      //Listen new markers
  useEffect(
    function () {
      socket.on("marcador-nuevo", (marcador) => {
        addMarker(marcador, marcador.id);
      });
    },
    [socket, addMarker]
  );


    // moviendo de los marcadores
 useEffect(
        function () {
          moveMarker$.subscribe(( marker ) => {
            socket.emit('marcador-actualizado', marker);
          });
        },
        [moveMarker$, socket]
      );


  //mover marcadores con socket 
  useEffect(
    function () {
      socket.on('marcador-actualizado', ( marker ) => {
        updatePosition(marker);
      });
    },
    [socket, updatePosition]
  );


   //nuevo marcador
   useEffect(
    function () {
      newMarker$.subscribe((marker) => socket.emit("marcador-nuevo", marker));
    },
    [newMarker$, socket]
  );

  return (
    <>
      <div className="info-windows">
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainer" />
    </>
  );
};