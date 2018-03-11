import {
  API_FETCH,
  INITIAL_FETCH_SUCCESS,
  STATION_FETCH_SUCCESS,
  FETCH_FAIL
} from '../actions/actionTypes';

export default function interplanetaryStations(state = {
  clientKey: null,
  timestamp: null,
  stations: [],
  error: false,
  loading: false
}, action) {
  switch (action.type) {

    case API_FETCH:
      return Object.assign({}, state, {
        loading: true
      });

    case INITIAL_FETCH_SUCCESS:
      let stations = action.response.stations
      Object.keys(stations).map(station => {
        stations[station].time = action.response.time
      })
      return Object.assign({}, state, {
        clientKey: action.response.clientKey,
        stations: stations,
        loading: false,
      });

    case STATION_FETCH_SUCCESS:
      let editedStations = JSON.parse(JSON.stringify(state.stations)) //i don't know why but object assign don't want to work here
      let response = action.response

      editedStations[action.station].enabled = response.enabled
      editedStations[action.station].time = response.time

      if (response.delta.length > 0) {
        editedStations[action.station].points.splice(0, response.delta.length)
        response.delta.map(point => {
          editedStations[action.station].points.push(point)
        })
      }
      return Object.assign({},state,{
        stations: editedStations
      })

    case FETCH_FAIL:
      console.log(action.error)

    default:
      return state;
  }
}
