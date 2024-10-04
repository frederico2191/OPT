import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getStops, getSchedules } from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import './index';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import { getCurrentTimeInMinutes } from "../../api/utils"; 

const MapAccessToken = "pk.eyJ1IjoidGhpYWdvc29icmFsIiwiYSI6ImNseTF3Y3Y1djB6MW8yaXI2Z255bjk1Y2oifQ.CvNetOTQhag4--2DUS8_Pg";

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

    // Wait for the map to load before adding markers
    map.on('load', async () => {
      try {
        const stops = await getStops();
        setStops(stops);

        stops.forEach((stop) => {
          if (stop?.longitude && stop?.latitude) {
            const marker = new mapboxgl.Marker()
              .setLngLat([stop.longitude, stop.latitude]);

            const popup = new mapboxgl.Popup(); 

            // The marker's element needs to be ready before trying to add it to the map???
            marker.getElement() ? marker.addTo(map) : console.error("Marker element is undefined for stop:", stop);

            marker.getElement()?.addEventListener('click', async () => {
              const schedules = await getSchedules(stop?.code);
              const upcomingBuses = schedules.filter(bus => {
                const busTime = bus.time; 
                const minutesToArrival = busTime - currentTime; 
                return minutesToArrival >= 0 && minutesToArrival <= 60;
              });

              let popupContent = `<strong>${stop?.name}</strong><br/>${stop?.code}<br/>`;
              if (upcomingBuses.length === 0) {
                popupContent += "<br/>Sem chegadas na próxima hora";
              } else {
                upcomingBuses.forEach(bus => {
                  const minutesToArrival = bus.time - currentTime; 
                  let color;
                  if (minutesToArrival < 3) {
                    color = 'red';
                  } else if (minutesToArrival < 5) {
                    color = 'orange';
                  } else {
                    color = 'black';
                  }
                  popupContent += `<span>${bus.line} ${bus.lineName} <span style="color:${color}">${minutesToArrival} min</span></span><br />`;
                });
              }

              popup.setHTML(popupContent)
                   .setLngLat([stop.longitude, stop.latitude]) 
                   .addTo(map); 

              navigate(fromURL, { state: { code: stop?.code } });
            });
          } else {
            console.warn("Invalid stop coordinates:", stop);
          }
        });
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    });

    return () => map.remove();
  }, [currentTime, fromURL, navigate]); 

  return (
    <div id="map-container">
      <div
        id="map"
        style={{
          width: "100%",
          height: "600px",
        }}
      ></div>
    </div>
  );
};

export default MapComponent;
