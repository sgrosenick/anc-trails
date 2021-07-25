import { LOGIN, REGISTER } from '../actions/actions';

const initalState = {
    loggedIn = false,

}

export default function(state = initalState, action) {
    switch (action.type) {
        case "LOGIN":


            break;
        case "REGISTER":

            break;

        default:
            return state;
    }
}