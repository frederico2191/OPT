// PopupContent.jsx
import React from 'react';

const PopupContent = ({ stop, schedules, currentTime }) => {
  let content = `<strong>${stop.name}</strong><br/>${stop.code}<br/>`;

  const upcomingBuses = schedules.filter(bus => {
    const minutesToArrival = bus.time - currentTime;
    return minutesToArrival >= 0 && minutesToArrival <= 60;
  });

  if (upcomingBuses.length === 0) {
    content += "<br/>Sem chegadas na próxima hora";
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

      content += `<span>${bus.line} ${bus.lineName} <span style="color:${color}">${minutesToArrival} min</span></span><br />`;
      console.log("content!!", content)
    });
  }

  return content;
};

export default PopupContent;
