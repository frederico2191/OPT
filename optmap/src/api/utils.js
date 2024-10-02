import axios from "axios"

export const awaitResponse = async (url) => { 
    try {
        const response = await axios.get(url)
        return response
    } catch (error) {
        return { error }
    }
}