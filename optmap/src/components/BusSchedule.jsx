import React from "react";

const BusSchedule = ({ bus, currentTime }) => {
  const minutesToArrival = bus.time - currentTime;
  let color;

  if (minutesToArrival < 3) {
    color = 'red';
  } else if (minutesToArrival < 5) {
    color = 'orange';
  } else {
    color = 'black';
  }

  return (
    <span style={{ color }}>
      {bus.line} {bus.lineName} {minutesToArrival} min
    </span>
  );
};

export default BusSchedule;
