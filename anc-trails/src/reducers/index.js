import { combineReducers } from 'redux';
import { LOAD_TRACKS, GET_TOKEN, SHOW_2020_TRACKS } from '../actions/actions';

const initalTracksState = {
    accessToken: "",
    tracks: [],
    tracksLoaded2020: false,
    tracksLoaded2019: false,
    tracksLoaded2018: false,
    tracksLoaded2017: false,
    tracksLoaded2016: false,
    tracksLoaded2015: false,
    show2020Tracks: true
}

const tracksReducer = (state = initalTracksState, action) => {
    switch(action.type) {
        case LOAD_TRACKS:
            return {
                ...state,
                tracks: action.payload.tracks,
                tracksLoaded2020: true
            }
        case GET_TOKEN:
            return Object.assign({}, state, {
                accessToken: action.payload.token
            })
        case SHOW_2020_TRACKS:
            return {
                ...state,
                show2020Tracks: !action.payload.show2020Tracks
            }
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    tracksReducer
});

export default rootReducer;