import { LOGIN, REGISTER } from './actions';

export function login() {
    return function(dispatch) {
        const url = new URL('https://anc-trails.herokuapp.com/api/streets');

        fetch(url)
            .then(response => response.json())
            .then(data => dispatch(processStreetsResponse(data)))
            .catch(error => console.log(error));
    }
}