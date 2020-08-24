const hereAppCode = '0XXQyxbiCjVU7jN2URXuhg'
const hereAppId = 'yATlKFDZwdLtjHzyTeCK'

export const RECEIVE_PLACES_RESULTS = 'RECIEVE_PLACES_RESULTS';
export const REQUEST_PLACES_RESULTS = 'REQUEST_PLACES_RESULTS';
export const CLEAR = 'CLEAR';
export const UPDATE_BBOX = 'UPDATE_BBOX';
export const LOAD_TRACKS = 'LOAD_TRACKS';
export const GET_TOKEN = 'GET_TOKEN';
export const REMOVE_2020_TRACKS = 'REMOVE_2020_TRACKS';

export const fetchHerePlaces = payload => (dispatch, getState) => {
    // sample dispatcher will make our loading icon spin
    dispatch(requestPlacesResults({ category: payload.category }));

    const { boundingbox } = getState().placesControls;

    // to learn more about the parameters use this link https://developer.here.com/documentation/places/topics/search-results-ranking.html
    const url = new URL(
        'https://places.demo.api.here.com/places/v1/discover/explore'
    )

    const params = {
        app_id: hereAppId,
        app_code: hereAppCode,
        // this will come from the map class component which yet has to be coded
        in: boundingbox,
        // the amount of places
        size: 100,
        // and the category clicked by the user
        cat: payload.category
    }

    url.search = new URLSearchParams(params);

    return fetch(url)
        .then(response => response.json())
        .then(data => 
            dispatch(
                processPlacesResponse(
                    data,
                    payload.category,
                    boundingbox,
                    payload.color
                )
            )
        )
        .catch(error => console.log(error));
}

export const getActivities = payload => (dispatch) => {
  const url = new URL('https://www.strava.com/api/v3/athlete/activities?after=1577836800&per_page=200&access_token=' + payload.token);

  return fetch(url)
    .then(response => response.json())
    .then(data => dispatch(proccessTracksResponse(data)))
    .catch(error => console.log(error));
}

export const getAccessToken = () => (dispatch) => {

  const authLink = new URL("https://www.strava.com/oauth/token");

  return fetch(authLink, {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          refresh_token: process.env.REACT_APP_REFRESH_TOKEN,
          grant_type: 'refresh_token'
      })
  }).then(res => res.json())
      .then(res => dispatch(processAccessTokenResponse(res)));
}

// to clear the places!
export const clear = () => ({
    type: CLEAR
  })

const parsePlacesResponse = json => {
    if (json.results && json.results.items.length > 0) {
      return json.results.items
    }
    return []
  }
  
  const processPlacesResponse = (json, category, bbox, color) => dispatch => {
    const results = parsePlacesResponse(json)
  
    // the response is parsed and ready to be dispatched to our reducer
    dispatch(
      receivePlacesResults({
        data: results,
        category: category,
        boundingbox: bbox,
        color: color
      })
    )
  }

  const processAccessTokenResponse = json => dispatch => {
    const token = json.access_token;

      dispatch(getToken({
        token: token
      }));
  }

  const parseTracksResponse = json => {
    if (json.results && json.results.items.length > 0) {
      return json.results.items;
    }
  }

  const proccessTracksResponse = (json) => dispatch => {
    const results = parseTracksResponse(json);

    dispatch(loadTracks({
      tracks: json
    }));
  }

export const receivePlacesResults = places => ({
    type: RECEIVE_PLACES_RESULTS,
    payload: places
  })
  
export const requestPlacesResults = category => ({
    type: REQUEST_PLACES_RESULTS,
    payload: category
  })

export const doUpdateBoundingBox = boundingbox => dispatch => {
    const bbox = [
        boundingbox._southWest.lng,
        boundingbox._southWest.lat,
        boundingbox._northEast.lng,
        boundingbox._northEast.lat
    ].join(',');

    dispatch(updateBoundingBox(bbox));
}

export const loadTracks = tracks => ({
  type: LOAD_TRACKS,
  payload: tracks
});

export const getToken = token =>({
  type: GET_TOKEN,
  payload: token
})

const updateBoundingBox = bbox => ({
    type: UPDATE_BBOX,
    payload: bbox
});

export const toggle2020Tracks = toggle => ({
  type: REMOVE_2020_TRACKS,
  payload: toggle
});