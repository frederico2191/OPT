import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getStops, getSchedules } from "../../api"; // Ensure getSchedules is defined in your API
import { useNavigate, useSearchParams } from "react-router-dom";
import './index';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getCurrentTimeInMinutes } from "../../api/utils";

const MapAccessToken = "pk.eyJ1IjoidGhpYWdvc29icmFsIiwiYSI6ImNseTF3Y3Y1djB6MW8yaXI2Z255bjk1Y2oifQ.CvNetOTQhag4--2DUS8_Pg";

const MapComponent = () => {
  const [currentTime, setCurrentTime] = useState(0);
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

    (async () => {
      const stops = await getStops();
      setStops(stops);

      stops?.forEach((stop) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([stop?.longitude, stop?.latitude])
          .addTo(map);

        const popup = new mapboxgl.Popup(); 

        marker.getElement().addEventListener('click', async () => {
          console.log("stop?code importanteE!!!!!! 4444 ", stop?.code);
          const schedules = await getSchedules(stop?.code);
          console.log("schedules after click", schedules)
          
          const upcomingBuses = schedules.filter(bus => {
            console.log("currentTime for calculating upcoming buses",currentTime)
            const busTime = bus.time; 
            console.log("busTime", busTime)
            const minutesToArrival = busTime - currentTime; 
            console.log("minutes to arrival!!", minutesToArrival)
            return minutesToArrival >= 0 && minutesToArrival <= 60;
          });


          let popupContent = `<strong>${stop?.name}</strong>`;
          if (upcomingBuses.length === 0) {
            popupContent += "Sem chegadas previstas na próxima hora";
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
              popupContent += `<span style="color:${color}">Bus ${bus.lineName} will arrive in ${minutesToArrival} minutes</span><br />`;
            });
          }


          popup.setHTML(popupContent)
               .setLngLat([stop?.longitude, stop?.latitude]) 
               .addTo(map); 
          popup.addTo(map); 

          navigate(fromURL, { state: { code: stop?.code } });
        });
        console.log("stop important!!!55555", stop);
      });
    })();

    return () => map.remove();
  }, [currentTime, fromURL, navigate]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "600px",
      }}
    ></div>
  );
};

export default MapComponent;




// const MapComponent = () => {
//   const [stops, setStops] = useState([]);
//   const [viewport, setViewport] = useState({
//     latitude: 41.14961, // Centered on Porto
//     longitude: -8.61099, // Centered on Porto
//     zoom: 12,
//     width: '100vw',
//     height: '100vh'
//   });

//   useEffect(() => {
//     const fetchStops = async () => {
//       const fetchedStops = await getStops();
//       setStops(fetchedStops);
//     };

//     fetchStops();
//   }, []);

//   return (
//     <Map
//       {...viewport}
//       mapboxAccessToken={MapAccessToken}
//       onViewportChange={setViewport}
//       mapStyle="mapbox://styles/mapbox/streets-v11"
//     >
//       {stops.map(stop => (
//         <Marker key={stop.id} latitude={stop.latitude} longitude={stop.longitude}>
//           <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '10px', height: '10px' }} />
//         </Marker>
//       ))}
//     </Map>
//   );
// };

// export default MapComponent;








// const MapComponent = () => {
//   const [stops, setStops] = useState([]);
//   const [searchParams] = useSearchParams();
//   const [searched, setSearched] = useState('');
//   const navigate = useNavigate();
//   const fromURL = searchParams.get('query');

//   useEffect(() => {
//     setSearched(fromURL);
//   }, [fromURL]);

//   useEffect(() => {
//     mapboxgl.accessToken = MapAcessToken;

//     const map = new mapboxgl.Map({
//       container: "map",
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [-8.62, 41.15], // Adjust if necessary
//       zoom: 10,
//     });

//     const loadStops = async () => {
//       const stops = await getStops();
//       setStops(stops);

//       stops.forEach((stop) => {
//         const marker = new mapboxgl.Marker()
//           .setLngLat([stop.longitude, stop.latitude])
//           .setPopup(new mapboxgl.Popup().setHTML(`
//             <strong>${stop.name}</strong><br />
//             ${stop.code}
//           `))
//           .addTo(map);

//         marker.getElement().addEventListener('click', () => {
//           setSearched(stop.code);
//           navigate(`/${stop.code}`); // Adjust as needed
//         });
//       });

//       // Optionally fit bounds to markers if desired
//       const bounds = new mapboxgl.LngLatBounds();
//       stops.forEach((stop) => {
//         bounds.extend([stop.longitude, stop.latitude]);
//       });
//       map.fitBounds(bounds, { padding: 20 });
//     };

//     loadStops();

//     return () => {
//       map.remove();
//     };
//   }, [navigate]);

//   return (
//     <div id="map-container">
//       <div id="map" />
//     </div>
//   );
// };

// export default MapComponent;




// const MapAccessToken = "pk.eyJ1IjoidGhpYWdvc29icmFsIiwiYSI6ImNseTF3Y3Y1djB6MW8yaXI2Z255bjk1Y2oifQ.CvNetOTQhag4--2DUS8_Pg";

// const MapComponent = () => {
//   const [stops, setStops] = useState([]);
//   const [searchParams] = useSearchParams();
//   const [searched, setSearched] = useState('');
//   const navigate = useNavigate();

//   const fromURL = searchParams.get('query');

//   useEffect(() => {
//     setSearched(fromURL);
//   }, [fromURL]);

//   mapboxgl.accessToken = MapAccessToken;

//   useEffect(() => {
//     const map = new mapboxgl.Map({
//       container: "map",
//       style: "mapbox://styles/mapbox/streets-v11", // Map style
//       center: [-8.62, 41.15],
//       zoom: 10,
//     });

//     // Wait for the map to load
//     map.on('load', async () => {
//       const stops = await getStops();
//       setStops(stops);
//       console.log("response from get stops", stops);




//       stops.forEach((stop) => {
//         // Create a custom marker element
//         const markerElement = document.createElement('div');
//         markerElement.className = 'marker'; // Add a class for styling if needed
//         markerElement.style.width = '15px'; // Set width
//         markerElement.style.height = '15px'; // Set height
//         markerElement.style.backgroundColor = 'red'; // Set background color (for visibility)
//         markerElement.style.borderRadius = '50%'; // Make it circular

//         const marker = new mapboxgl.Marker(markerElement)
//           .setLngLat([stop.longitude, stop.latitude])
//           .setPopup(new mapboxgl.Popup().setHTML(`
//             <strong>${stop.name}</strong><br />
//             ${stop.code}
//           `))
//           .addTo(map);
        
//         markerElement.addEventListener('click', () => {
//           setSearched(stop.code);
//           console.log("stop?code", stop.code);
//           navigate(`${fromURL}&code=${stop.code}`); 
//         });
//         console.log("stop?", stop);
//       });
//     });

//     return () => {
//       map.remove();
//     };
//   }, [fromURL, navigate]); // Include fromURL and navigate here

//   return (
//     <div
//       id="map"
//       style={{
//         width: "80%",
//         height: "600px",
//       }}
//     ></div>
//   );
// };

// export default MapComponent;
