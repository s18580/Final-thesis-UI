import axios from 'axios';

const CallAPI = axios.create({
  baseURL: `https://printingapi.azurewebsites.net/api/`,
  headers: {
    Accept: 'application/json',
  }
})

export default CallAPI;