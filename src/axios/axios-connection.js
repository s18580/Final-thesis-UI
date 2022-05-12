import axios from 'axios';

const CallAPI = axios.create({
  baseURL: `http://localhost:5027/api/`,
  headers: {
    Accept: 'application/json',
  }
})

export default CallAPI;