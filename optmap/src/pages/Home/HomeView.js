import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL JS
import { getStops } from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";



const MapAcessToken = "pk.eyJ1IjoidGhpYWdvc29icmFsIiwiYSI6ImNseTF3Y3Y1djB6MW8yaXI2Z255bjk1Y2oifQ.CvNetOTQhag4--2DUS8_Pg"


const MapComponent = () => {
  const [stops, setStops] = useState([]);
  const [searchParams] = useSearchParams();
  const [searched, setSearched] = useState('');
  const navigate = useNavigate();

  const fromURL = searchParams.get('query');

  useEffect(() => {
    setSearched(fromURL);
  }, [fromURL]);

  mapboxgl.accessToken = MapAcessToken;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-8.62, 41.15],
      zoom: 10,
    });

    const loadStops = async () => {
      const stops = await getStops();
      setStops(stops);
      
      stops.forEach((stop) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([stop.longitude, stop.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <strong>${stop.name}</strong><br />
            ${stop.code}
          `))
          .addTo(map);

        marker.getElement().addEventListener('click', () => {
          setSearched(stop.code);
          navigate(`/${stop.code}`); 
        });
      });
    };

    loadStops();

    return () => {
      map.remove();
    };
  }, [navigate]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "600px",
      }}
    />
  );
};

export default MapComponent;




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
