import axios from 'axios';

const CallSeq = axios.create({
  baseURL: `http://20.55.97.173:8081/api/events/raw`,
  headers: {
    Accept: 'application/json',
  }
});

export default CallSeq;

/*
{
  "Events": [{
    "Timestamp": "2015-05-09T22:09:08.12345+10:00",
    "Level": "Warning",
    "MessageTemplate": "Disk space is low on {Drive}",
    "Properties": {
      "Drive": "C:",
      "MachineName": "nblumhardt-rmbp"
    }
  }]
}
*/