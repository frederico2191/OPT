import axios from "axios";
import { getCurrentTimeInMinutes } from "./utils";

const urlStops = "http://dev1.opt.pt:25566/stops";
const urlSchedules = "http://dev1.opt.pt:25566/arrivals/";
export const  MapAccessToken = "pk.eyJ1IjoidGhpYWdvc29icmFsIiwiYSI6ImNseTF3Y3Y1djB6MW8yaXI2Z255bjk1Y2oifQ.CvNetOTQhag4--2DUS8_Pg";


export const getStops = async () => {
  try {
    const response = await axios.get(urlStops);
    console.log("response", response);
    return response?.data;
  } catch (error) {
    console.log('error in getStops: ', error);
  }
};

export const getSchedules = async (id) => {
  try {
    const response = await axios.get(`${urlSchedules}${id}`);
    console.log("response from API", response);

    const currentTime = getCurrentTimeInMinutes();
    const filteredSchedules = response.data.filter(bus => {
      const busArrivalTime = bus.time;
      const minutesToArrival = busArrivalTime - currentTime;
      return minutesToArrival >= 0 && minutesToArrival <= 60;
    });

    return filteredSchedules;
  } catch (error) {
    console.log('error in getSchedules: ', error);
  }
};
