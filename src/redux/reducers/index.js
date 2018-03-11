import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import interplanetaryStations from './interplanetaryStations'

// main reducers
export const reducers = combineReducers({
  routing: routerReducer,
  interplanetaryStations: interplanetaryStations,
  // your reducer here
});
