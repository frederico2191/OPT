// PopupContent.js
import React from 'react';

const PopupContent = ({ stop, upcomingBuses }) => {
  return (
    <div style={{ width: '200px' }}>
      <strong>{stop.name}</strong>
      <div>{stop.code}</div>
      {upcomingBuses.length === 0 ? (
        <div>Sem chegadas previstas na próxima hora</div>
      ) : (
        upcomingBuses.map((bus, index) => {
          const minutesToArrival = bus.time - bus.currentTime; // Assuming bus has a currentTime property
          return (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center' }}>
              <div>{bus.line}</div>
              <div>{bus.lineName}</div>
              <div>{minutesToArrival} minutos</div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PopupContent;
