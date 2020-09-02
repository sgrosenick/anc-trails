import { combineReducers } from 'redux';
import { LOAD_TRACKS, GET_TOKEN, SHOW_2020_TRACKS, SHOW_2019_TRACKS, SHOW_2018_TRACKS, SHOW_2017_TRACKS, SHOW_2016_TRACKS, SHOW_2015_TRACKS } from '../actions/actions';

const initalTracksState = {
    accessToken: "",
    tracks: [],
    tracks2019: [],
    tracks2018: [],
    tracks2017: [],
    tracks2016: [],
    tracks2015: [],
    tracksLoaded2020: false,
    tracksLoaded2019: false,
    tracksLoaded2018: false,
    tracksLoaded2017: false,
    tracksLoaded2016: false,
    tracksLoaded2015: false,
    show2020Tracks: true,
    show2019Tracks: false,
    show2018Tracks: false,
    show2017Tracks: false,
    show2016Tracks: false,
    show2015Tracks: false
}

const tracksReducer = (state = initalTracksState, action) => {
    switch(action.type) {
        case LOAD_TRACKS:
            switch(action.payload.year) {
                case 2020:
                    return {
                        ...state,
                        tracks: action.payload.tracks,
                        tracksLoaded2020: true
                    }
                case 2019:
                    return {
                        ...state,
                        tracks2019: action.payload.tracks,
                        tracksLoaded2019: true
                    }
                case 2018:
                    return {
                        ...state,
                        tracks2018: action.payload.tracks,
                        tracksLoaded2018: true
                    }
                case 2017:
                    return {
                        ...state,
                        tracks2017: action.payload.tracks,
                        tracksLoaded2017: true
                    }
                case 2016:
                    return {
                        ...state,
                        tracks2016: action.payload.tracks,
                        tracksLoaded2016: true
                    }
                case 2015:
                    return {
                        ...state,
                        tracks2015: action.payload.tracks,
                        tracksLoaded2015: true
                    }
                default:
                    return state;
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
        case SHOW_2019_TRACKS:
            return {
                ...state,
                show2019Tracks: !action.payload.show2019Tracks
            }
        case SHOW_2018_TRACKS:
            return {
                ...state,
                show2018Tracks: !action.payload.show2018Tracks
            }
        case SHOW_2017_TRACKS:
            return {
                ...state,
                show2017Tracks: !action.payload.show2017Tracks
            }
        case SHOW_2016_TRACKS:
            return {
                ...state,
                show2016Tracks: !action.payload.show2016Tracks
            }
        case SHOW_2015_TRACKS:
            return {
                ...state,
                show2015Tracks: !action.payload.show2015Tracks
            }
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    tracksReducer
});

export default rootReducer;