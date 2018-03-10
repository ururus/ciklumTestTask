import 'whatwg-fetch'


const BASE_URL = 'http://localhost:8080/api/v1/'

function callApi(endpoint, method) {
  let methodType = method
  let options = {
    method: methodType,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(BASE_URL + endpoint, options).then((response) => {
      if (!response.ok) {
        return Promise.reject(response.statusText)
      }
      return response.json()
    })
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {

  const callAPI = action[CALL_API]

  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let {endpoint, types, method, station} = callAPI

  const [requestType, successType, errorType] = types
  next({type: requestType});
  return callApi(endpoint, method).then(
    response =>
      next({
        type: successType,
        response,
        station
      }),
    error => next({
      type: errorType,
      error: error
    })
  )
}

