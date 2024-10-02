import axios from "axios";

const urlStops = "http://dev1.opt.pt:25566/stops";
const urlSchedules = "http://dev1.opt.pt:25566/arrivals/"

export const getStops = async () => {
  try {
    const response = await axios.get(urlStops)
    console.log("response",response)
    return response?.data
  } catch (error) {
    console.log('error in getStops: ', error)
  }
};
const getSchedules = async (id) => {
  try {
    const response = await axios.get(`${urlSchedules}${id}`)
    console.log("response",response)
    return response?.data
  } catch (error) {
    console.log('error in getSchedules: ', error)
  }
}