import React from "react";
import mapboxgl from "mapbox-gl";
import PopupContent from "./PopupContent";
import { getSchedules } from "../api";

const MapMarker = ({ stop, map }) => {
    console.log("i am the marker stop infooo", stop)
  const handleClick = async () => {
    const schedules = await getSchedules(stop.code); // Fetch schedules for this stop
    const popupContent = <PopupContent stop={stop} schedules={schedules} />;
    
    new mapboxgl.Popup()
      .setHTML(popupContent)
      .setLngLat([stop.longitude, stop.latitude])
      .addTo(map);
  };

  new mapboxgl.Marker()
    .setLngLat([stop.longitude, stop.latitude])
    .addTo(map)
    .getElement()
    .addEventListener('click', handleClick);

  return null;
};

export default MapMarker;
