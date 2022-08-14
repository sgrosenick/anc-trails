export const CLEAR = 'CLEAR';
export const LOAD_STREETS = 'LOAD_STREETS';
export const RUN_ANALYSIS = 'RUN_ANALYSIS';
export const TRACKS_UPLOADING = 'TRACKS_UPLOADING';
export const UPLOAD_TRACKS = 'UPLOAD_TRACKS';
export const LOAD_TRACKS = 'LOAD_TRACKS';
export const GET_TOKEN = 'GET_TOKEN';
export const SHOW_2022_TRACKS = 'SHOW_2022_TRACKS';
export const SHOW_2021_TRACKS = 'SHOW_2021_TRACKS';
export const SHOW_2020_TRACKS = 'REMOVE_2020_TRACKS';
export const SHOW_2019_TRACKS = 'SHOW_2019_TRACKS';
export const SHOW_2018_TRACKS = 'SHOW_2018_TRACKS';
export const SHOW_2017_TRACKS = 'SHOW_2017_TRACKS';
export const SHOW_2016_TRACKS = 'SHOW_2016_TRACKS';
export const SHOW_2015_TRACKS = 'SHOW_2015_TRACKS';

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';

export const getActivities = payload => (dispatch) => {

  const url2022 = new URL('https://www.strava.com/api/v3/athlete/activities?after=1640995260&per_page=200&access_token=');
  const url2021 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1640995140&after=1609459260&per_page=200&access_token=');
  const url2020 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1609545600&after=1577836800&per_page=200&access_token=');
  const url2019 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1577750400&after=1546300800&per_page=200&access_token=');
  const url2018 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1546214400&after=1514764800&per_page=200&access_token=');
  const url2017 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1514678400&after=1483228800&per_page=200&access_token=');
  const url2016 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1483142400&after=1451606400&per_page=200&access_token=');
  const url2015 = new URL('https://www.strava.com/api/v3/athlete/activities?before=1451520000&after=1420070400&per_page=200&access_token=');

  var url = new URL('https://www.strava.com/api/v3/athlete/activities?after=1577836800&per_page=200&access_token=');

  switch(payload.year) {
    case 2022:
      url = url2022 + payload.token;
      break;
    case 2021:
      url = url2021 + payload.token;
      break;
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
    .then(data => dispatch(proccessTracksResponse(data, payload.year)))
    .catch(error => console.log(error));
}

export const getStreets = () => (dispatch) => {
  const url = new URL('https://anc-trails.herokuapp.com/api/streets');

  return fetch(url)
    .then(response => response.json())
    .then(data => dispatch(processStreetsResponse(data)))
    .catch(error => console.log(error));
}

export const startUploadTracks = (tracksUploading) => (dispatch) => {
   dispatch(startUpload(tracksUploading));
}

export const uploadTracks = (tracks) => (dispatch) => {
  const url = new URL('https://anc-trails.herokuapp.com/api/tracks');

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: tracks
  })
  .then(response => response.text())
  .then(data => dispatch(processUploadTracksResponse(data)))
  .catch(error => console.log(error));
}

export const startLogin = (user) => (dispatch) => {
    dispatch(login(user))
};

export const login = (user) => (dispatch) => {
  const url = new URL('https://anc-trails.herokuapp.com/api/users/login');

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  })
  .then(res => res.json())
  .then(data => dispatch(handleLogin(data)))
  .catch(err => {
    console.log(err)
  });
}

export const getAccessToken = (user) => (dispatch) => {
  const authLink = new URL("https://www.strava.com/oauth/token");

  let { strava_id, strava_key, strava_refresh } = user;

  return fetch(authLink, {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          client_id: strava_id,
          client_secret: strava_key,
          refresh_token: strava_refresh,
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

const processUploadTracksResponse = json => dispatch => {
  dispatch(uploadComplete({
    tracks: json
  }));
}

const processStreetsResponse = (json) => (dispatch) => {
  dispatch(loadStreets({
    streets: json
  }));
}

const proccessTracksResponse = (json, year) => dispatch => {
  const results = parseTracksResponse(json);

  dispatch(loadTracks({
    tracks: json,
    year: year
  }));
}

export const loadStreets = streets => ({
  type: LOAD_STREETS,
  payload: streets
});

export const runAnalysis = analysisRunning => ({
  type: RUN_ANALYSIS,
  payload: analysisRunning
});

export const startUpload = tracksUploading => ({
  type: TRACKS_UPLOADING,
  payload: tracksUploading
});

export const uploadComplete = tracks => ({
  type: UPLOAD_TRACKS,
  payload: tracks
});

export const loadTracks = tracks => ({
  type: LOAD_TRACKS,
  payload: tracks
});

export const getToken = token =>({
  type: GET_TOKEN,
  payload: token
})

export const toggle2022Tracks = toggle => ({
  type: SHOW_2022_TRACKS,
  payload: toggle
});

export const toggle2021Tracks = toggle => ({
  type: SHOW_2021_TRACKS,
  payload: toggle
});

export const toggle2020Tracks = toggle => ({
  type: SHOW_2020_TRACKS,
  payload: toggle
});

export const toggle2019Tracks = toggle => ({
  type: SHOW_2019_TRACKS,
  payload: toggle
});

export const toggle2018Tracks = toggle => ({
  type: SHOW_2018_TRACKS,
  payload: toggle
});

export const toggle2017Tracks = toggle => ({
  type: SHOW_2017_TRACKS,
  payload: toggle
});

export const toggle2016Tracks = toggle => ({
  type: SHOW_2016_TRACKS,
  payload: toggle
});

export const toggle2015Tracks = toggle => ({
  type: SHOW_2015_TRACKS,
  payload: toggle
});

export const handleLogin = user => ({
  type: LOGIN,
  payload: user
});