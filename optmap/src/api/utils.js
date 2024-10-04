import axios from "axios"

export const awaitResponse = async (url) => { 
    try {
        const response = await axios.get(url)
        return response
    } catch (error) {
        return { error }
    }
}

export const getCurrentTimeInMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };