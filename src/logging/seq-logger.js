import axios from 'axios';

const CallSeq = axios.create({
  baseURL: `http://localhost:8081/api/events/raw`,
  headers: {
    Accept: 'application/json',
  }
});

export default CallSeq;