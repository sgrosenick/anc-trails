import { combineReducers } from 'redux';
import { RECEIVE_PLACES_RESULTS, REQUEST_PLACES_RESULTS, CLEAR, UPDATE_BBOX, LOAD_TRACKS, GET_TOKEN, REMOVE_2020_TRACKS } from '../actions/actions';

const initialPlacesState = {
    boundingbox: '',
    lastCall: Date.now(),
    places: {},
    tracks: [],
    accessToken: "",
    tracksLoaded: false,
    remove2020Tracks: false
}

const placesControls = (state = initialPlacesState, action) => {
    switch(action.type) {
        // let button know we're requesting data
        case RECEIVE_PLACES_RESULTS:
            return {
                ...state,
                // when data was recieved
                lastCall: Date.now(),
                // updating our places object
                places: {
                    ...state.places,
                    // for the requested category
                    [action.payload.category]: {
                        ...state.places[action.payload.category],
                        // ternary operator to decide to merge calls
                        data: state.places[action.payload.category].hasOwnProperty('data')
                            ? [
                                ...state.places[action.payload.category].data,
                                ...action.payload.data
                            ]
                            : action.payload.data,
                        boundingbox: action.payload.boundingbox,
                        color: action.payload.color,
                        isFetching: false
                    } 
                }
            }
        case REQUEST_PLACES_RESULTS:
            return {
                ...state,
                places: {
                    ...state.places,
                    [action.payload.category]: {
                        ...state.places[action.payload.category],
                        isFetching: true
                    }
                }
            }
        case CLEAR:
            return {
                ...state,
                places: {},
                lastCall: Date.now(),
                lastCompute: Date.now() 
            }
        case UPDATE_BBOX:
            const newState = { ...state }
            newState.boundingbox = action.payload
            for (const obj in newState.places) {
                newState.places[obj].disabled = false
                newState.places[obj].next = undefined
                newState.places[obj].previous = undefined
            }

            return newState
        case LOAD_TRACKS:
            return {
                ...state,
                tracks: action.payload.tracks,
                tracksLoaded: true
            }
        case GET_TOKEN:
            return Object.assign({}, state, {
                accessToken: action.payload.token
            })
        case REMOVE_2020_TRACKS:
            return {
                ...state,
                remove2020Tracks: !action.payload.remove2020Tracks
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    placesControls
});

export default rootReducer;