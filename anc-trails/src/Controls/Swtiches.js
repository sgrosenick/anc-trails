import { withStyles } from '@material-ui/core/styles'; 
import { Switch } from '@material-ui/core';

export const Track2021Switch = withStyles({
    switchBase: {
        '&$checked': {
            color: process.env.REACT_APP_TRACK_2021_COLOR
        },
        '&$checked + $track': {
            backgroundColor: process.env.REACT_APP_TRACK_2021_COLOR
        },
    },
    checked: {},
    track: {}
})(Switch);

export const Track2020Switch = withStyles({
    switchBase: {
        '&$checked': {
            color: process.env.REACT_APP_TRACK_2020_COLOR
        },
        '&$checked + $track': {
            backgroundColor: process.env.REACT_APP_TRACK_2020_COLOR
        },
    },
    checked: {},
    track: {}
})(Switch);

export const Track2019Switch = withStyles({
    switchBase: {
        '&$checked': {
            color: process.env.REACT_APP_TRACK_2019_COLOR
        },
        '&$checked + $track': {
            backgroundColor: process.env.REACT_APP_TRACK_2019_COLOR
        },
    },
    checked: {},
    track: {}
})(Switch);

export const Track2018Switch = withStyles({
    switchBase: {
        '&$checked': {
            color: process.env.REACT_APP_TRACK_2018_COLOR
        },
        '&$checked + $track': {
            backgroundColor: process.env.REACT_APP_TRACK_2018_COLOR
        },
    },
    checked: {},
    track: {}
})(Switch);

export const Track2017Switch = withStyles({
    switchBase: {
        '&$checked': {
            color: process.env.REACT_APP_TRACK_2017_COLOR
        },
        '&$checked + $track': {
            backgroundColor: process.env.REACT_APP_TRACK_2017_COLOR
        },
    },
    checked: {},
    track: {}
})(Switch);

export const Track2016Switch = withStyles({
    switchBase: {
        '&$checked': {
            color: process.env.REACT_APP_TRACK_2016_COLOR
        },
        '&$checked + $track': {
            backgroundColor: process.env.REACT_APP_TRACK_2016_COLOR
        },
    },
    checked: {},
    track: {}
})(Switch);

export const Track2015Switch = withStyles({
    switchBase: {
        '&$checked': {
            color: process.env.REACT_APP_TRACK_2015_COLOR
        },
        '&$checked + $track': {
            backgroundColor: process.env.REACT_APP_TRACK_2015_COLOR
        },
    },
    checked: {},
    track: {}
})(Switch);