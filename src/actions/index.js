import {CALL_API} from '../middleware/api'

import {
  API_FETCH,
  INITIAL_FETCH_SUCCESS,
  STATION_FETCH_SUCCESS,
  FETCH_FAIL
} from './actionTypes';

function initialFetch() {
  return {
    [CALL_API]: {
      endpoint: 'init',
      types: [API_FETCH,INITIAL_FETCH_SUCCESS,FETCH_FAIL],
      method: "GET"
    }
  }
}
function stationFetch(clientKey,station,timeStamp) {
  return {
    [CALL_API]: {
      endpoint: 'client/'+clientKey+'/delta/'+station+'/since/'+timeStamp,
      types: [API_FETCH,STATION_FETCH_SUCCESS,FETCH_FAIL],
      method: "GET",
      station: station
    }
  }
}


module.exports = {
  initialFetch,
  stationFetch
}
