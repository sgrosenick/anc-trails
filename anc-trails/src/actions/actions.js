export const CLEAR = 'CLEAR';
export const LOAD_TRACKS = 'LOAD_TRACKS';
export const GET_TOKEN = 'GET_TOKEN';
export const SHOW_2020_TRACKS = 'REMOVE_2020_TRACKS';

export const getActivities = payload => (dispatch) => {

  const url2020 = new URL('https://www.strava.com/api/v3/athlete/activities?after=1577836800&per_page=200&access_token=');
  const url2019 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1577750400&after=1546300800&per_page=200&access_token=');
  const url2018 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1546214400&after=1514764800&per_page=200&access_token=');
  const url2017 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1514678400&after=1483228800&per_page=200&access_token=');
  const url2016 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1483142400&after=1451606400&per_page=200&access_token=');
  const url2015 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1451520000&after=1420070400&per_page=200&access_token=');

  var url = new URL('https://www.strava.com/api/v3/athlete/activities?after=1577836800&per_page=200&access_token=');

  switch(payload.year) {
    case 2020:
      url = url2020 + payload.token;
      break;
    case 2019:
      url = url2019 + payload.token;
      break;
    case 2018:
      url = url2018 + payload.token;
      break;
    case 2017:
      url = url2017 + payload.token;
      break;
    case 2016:
      url = url2016 + payload.token;
      break;
    case 2015:
      url = url2015 + payload.token;
      break;
  }

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

export const loadTracks = tracks => ({
  type: LOAD_TRACKS,
  payload: tracks
});

export const getToken = token =>({
  type: GET_TOKEN,
  payload: token
})

export const toggle2020Tracks = toggle => ({
  type: SHOW_2020_TRACKS,
  payload: toggle
});