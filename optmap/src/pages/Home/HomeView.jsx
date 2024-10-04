import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getStops, getSchedules, MapAccessToken } from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import './index';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import { getCurrentTimeInMinutes } from "../../api/utils"; 

const MapComponent = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInMinutes());
  const [stops, setStops] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fromURL = searchParams.get('query');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = MapAccessToken;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-8.62, 41.15],
      zoom: 10,
    });

    const loadStops = async () => {
      try {
        const fetchedStops = await getStops();
        setStops(fetchedStops);
        fetchedStops.forEach(initializeMarker);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };

    const initializeMarker = (stop) => {
      if (stop?.longitude && stop?.latitude) {
        const marker = new mapboxgl.Marker().setLngLat([stop.longitude, stop.latitude]);
        marker.addTo(map);
        marker.getElement()?.addEventListener('click', () => handleMarkerClick(stop));
      } else {
        console.warn("Invalid stop coordinates:", stop);
      }
    };

    const handleMarkerClick = async (stop) => {
      const schedules = await getSchedules(stop?.code);
      const upcomingBuses = schedules.filter(bus => {
        const minutesToArrival = bus.time - currentTime;
        return minutesToArrival >= 0 && minutesToArrival <= 60;
      });

      const popupContent = createPopupContent(stop, upcomingBuses);
      new mapboxgl.Popup()
        .setHTML(popupContent)
        .setLngLat([stop.longitude, stop.latitude])
        .addTo(map);

      navigate(fromURL, { state: { code: stop?.code } });
    };

    const createPopupContent = (stop, upcomingBuses) => {
      let content = `<strong>${stop?.name}</strong><br/>${stop?.code}<br/>`;
      if (upcomingBuses.length === 0) {
        content += "<br/>Sem chegadas na próxima hora";
      } else {
        upcomingBuses.forEach(bus => {
          const minutesToArrival = bus.time - currentTime;
          const color = getBusColor(minutesToArrival);
          const trimmedLineName = bus.lineName.length > 16 ? `${bus.lineName.slice(0, 16)}...` : bus.lineName;

          content += `
            <div id="popup-container">
              <span>${bus.line} ${trimmedLineName}</span>
              <span style="margin-left: 5px; color:${color};">${minutesToArrival} min</span>
            </div>
            <br />
          `;
        });
      }
      return content;
    };

    const getBusColor = (minutesToArrival) => {
      if (minutesToArrival < 3) return 'red';
      if (minutesToArrival < 5) return 'orange';
      return 'black';
    };

    map.on('load', loadStops);
    return () => map.remove();
  }, [currentTime, fromURL, navigate]); 

  return (
    <div id="map-container">
      <div id="map" />
    </div>
  );
};

export default MapComponent;
