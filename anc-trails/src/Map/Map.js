import React from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAccessToken, getActivities, SHOW_2019_TRACKS } from '../actions/actions';
import { popupStyle } from './Popup';
import 'polyline-encoded';
import "../style/popup.scss"

const style = {
    width: '100%',
    height: '100vh'
};

const Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });

const tracksLayer2020 = L.featureGroup();
const tracksLayer2019 = L.featureGroup();
const tracksLayer2018 = L.featureGroup();
const tracksLayer2017 = L.featureGroup();
const tracksLayer2016 = L.featureGroup();
const tracksLayer2015 = L.featureGroup();

const mapParams = {
    center: [61.160149, -149.96],
    zoomControl: false,
    zoom: 11.35,
    layers: [tracksLayer2020, tracksLayer2019, tracksLayer2018, tracksLayer2017, tracksLayer2016, tracksLayer2015, Stadia_AlidadeSmoothDark]
}

class Map extends React.Component {
    static propTypes = {
        lastCompute: PropTypes.number,
        dbscanSettings: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        tracks: PropTypes.array,
        tracks2019: PropTypes.array,
        accessToken: PropTypes.string
      }

    componentDidMount() {
        const { dispatch } = this.props;

        this.map = L.map('map', mapParams);

        this.map.on('moveend', () => {
            //dispatch(doUpdateBoundingBox(this.map.getBounds()));
        });
        this.map.on('click', function(e) {
            tracksLayer2020.setStyle({color: process.env.REACT_APP_TRACK_2020_COLOR, weight: 2});
            tracksLayer2019.setStyle({color: process.env.REACT_APP_TRACK_2019_COLOR, weight: 2});
            tracksLayer2018.setStyle({color: process.env.REACT_APP_TRACK_2018_COLOR, weight: 2});
            tracksLayer2017.setStyle({color: process.env.REACT_APP_TRACK_2017_COLOR, weight: 2});
            tracksLayer2016.setStyle({color: process.env.REACT_APP_TRACK_2016_COLOR, weight: 2});
            tracksLayer2015.setStyle({color: process.env.REACT_APP_TRACK_2015_COLOR, weight: 2});
        });
        
        tracksLayer2020.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer2020.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2020_COLOR, weight: 2});
                if (layer._leaflet_id === selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_HIGHLIGHT_COLOR, weight: 4});
                    layer.bringToFront();
                }
            })
        });

        tracksLayer2019.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer2019.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2019_COLOR, weight: 2});
                if (layer._leaflet_id === selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_HIGHLIGHT_COLOR, weight: 4});
                    layer.bringToFront();
                }
            })
        });

        tracksLayer2018.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer2018.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2018_COLOR, weight: 2});
                if (layer._leaflet_id === selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_HIGHLIGHT_COLOR, weight: 4});
                    layer.bringToFront();
                }
            })
        });

        tracksLayer2017.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer2017.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2017_COLOR, weight: 2});
                if (layer._leaflet_id === selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_HIGHLIGHT_COLOR, weight: 4});
                    layer.bringToFront();
                }
            })
        });

        tracksLayer2016.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer2016.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2016_COLOR, weight: 2});
                if (layer._leaflet_id === selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_HIGHLIGHT_COLOR, weight: 4});
                    layer.bringToFront();
                }
            })
        });

        tracksLayer2015.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer2015.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2015_COLOR, weight: 2});
                if (layer._leaflet_id === selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_HIGHLIGHT_COLOR, weight: 4});
                    layer.bringToFront();
                }
            })
        });

        dispatch(getAccessToken());

        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
    }

    componentDidUpdate(prevProps) {
        const { accessToken, dispatch, tracks, tracks2019, tracks2018, tracks2017, tracks2016, tracks2015,
            tracksLoaded2020, tracksLoaded2019, tracksLoaded2018, tracksLoaded2017, tracksLoaded2016, tracksLoaded2015,
            show2020Tracks, show2019Tracks, show2018Tracks, show2017Tracks, show2016Tracks, show2015Tracks } = this.props;

        // TRACKS LOADED
        if (accessToken !== "" && tracksLoaded2020 === false) {
            dispatch(getActivities({token: accessToken, year: 2020}))
        }

        if (accessToken !== "" && tracksLoaded2020 === true && tracksLoaded2019 === false) {
            dispatch(getActivities({token: accessToken, year: 2019}))
        }

        if (accessToken !== "" && tracksLoaded2019 === true && tracksLoaded2018 === false) {
            dispatch(getActivities({token: accessToken, year: 2018}))
        }

        if (accessToken !== "" && tracksLoaded2018 === true && tracksLoaded2017 === false) {
            dispatch(getActivities({token: accessToken, year: 2017}))
        }

        if (accessToken !== "" && tracksLoaded2017 === true && tracksLoaded2016 === false) {
            dispatch(getActivities({token: accessToken, year: 2016}))
        }

        if (accessToken !== "" && tracksLoaded2016 === true && tracksLoaded2015 === false) {
            dispatch(getActivities({token: accessToken, year: 2015}))
        }

        // ADD TRACKS
        if (tracksLoaded2020 === true && tracks !== prevProps.tracks) {
            this.addTracks(2020);
        }

        if (tracksLoaded2019 === true && tracks2019 !== prevProps.tracks2019) {
            this.addTracks(2019);
        }

        if (tracksLoaded2018 === true && tracks2018 !== prevProps.tracks2018) {
            this.addTracks(2018);
        }

        if (tracksLoaded2017 === true && tracks2017 !== prevProps.tracks2017) {
            this.addTracks(2017);
        }

        if (tracksLoaded2016 === true && tracks2016 !== prevProps.tracks2016) {
            this.addTracks(2016);
        }

        if (tracksLoaded2015 === true && tracks2015 !== prevProps.tracks2015) {
            this.addTracks(2015);
        }

        // SHOW TRACKS
        if (show2020Tracks === false) {
            this.map.removeLayer(tracksLayer2020);
        } else {
            this.map.addLayer(tracksLayer2020);
        }

        if (show2019Tracks === false) {
            this.map.removeLayer(tracksLayer2019);
        } else {
            this.map.addLayer(tracksLayer2019);
        }

        if (show2018Tracks === false) {
            this.map.removeLayer(tracksLayer2018);
        } else {
            this.map.addLayer(tracksLayer2018);
        }

        if (show2017Tracks === false) {
            this.map.removeLayer(tracksLayer2017);
        } else {
            this.map.addLayer(tracksLayer2017);
        }

        if (show2016Tracks === false) {
            this.map.removeLayer(tracksLayer2016);
        } else {
            this.map.addLayer(tracksLayer2016);
        }

        if (show2015Tracks === false) {
            this.map.removeLayer(tracksLayer2015);
        } else {
            this.map.addLayer(tracksLayer2015);
        }
    }

    addTracks(year) {

        switch(year) {
            case 2020:
                tracksLayer2020.clearLayers();

                const { tracks } = this.props;

                for (const track of tracks) {
                    if (track.type === "Ride") {
                        const coords = L.Polyline.fromEncoded(track.map.summary_polyline).getLatLngs();

                        const newLine = L.polyline(
                            coords,
                            {
                                color: process.env.REACT_APP_TRACK_2020_COLOR,
                                weight: 2
                            }
                        );
                
                        const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2020);
                    }
                }
                break;
            case 2019:
                tracksLayer2019.clearLayers();

                const { tracks2019 } = this.props;

                for (const track of tracks2019) {
                    if (track.type === "Ride") {
                        const coords = L.Polyline.fromEncoded(track.map.summary_polyline).getLatLngs();

                        const newLine = L.polyline(
                            coords,
                            {
                                color: process.env.REACT_APP_TRACK_2019_COLOR,
                                weight: 2
                            }
                        );
                        
                        const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2019);
                    }
                }
                break;
            case 2018:
                tracksLayer2018.clearLayers();

                const { tracks2018 } = this.props;

                for (const track of tracks2018) {
                    if (track.type === "Ride") {
                        const coords = L.Polyline.fromEncoded(track.map.summary_polyline).getLatLngs();

                        const newLine = L.polyline(
                            coords,
                            {
                                color: process.env.REACT_APP_TRACK_2018_COLOR,
                                weight: 2
                            }
                        );
            
                        const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2018);
                    }
                }
                break;
            case 2017:
                tracksLayer2017.clearLayers();

                const { tracks2017 } = this.props;

                for (const track of tracks2017) {
                    if (track.type === "Ride") {
                        const coords = L.Polyline.fromEncoded(track.map.summary_polyline).getLatLngs();

                        const newLine = L.polyline(
                            coords,
                            {
                                color: process.env.REACT_APP_TRACK_2017_COLOR,
                                weight: 2
                            }
                        );
            
                        const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2017);
                    }
                }
                break;
            case 2016:
                tracksLayer2016.clearLayers();

                const { tracks2016 } = this.props;

                for (const track of tracks2016) {
                    if (track.type === "Ride") {
                        const coords = L.Polyline.fromEncoded(track.map.summary_polyline).getLatLngs();

                        const newLine = L.polyline(
                            coords,
                            {
                                color: process.env.REACT_APP_TRACK_2016_COLOR,
                                weight: 2
                            }
                        );
                
                        const popupText = popupStyle(track); 
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2016);
                    }
                }
                break;
            case 2015:
                tracksLayer2015.clearLayers();

                const { tracks2015 } = this.props;

                for (const track of tracks2015) {
                    if (track.type === "Ride") {
                        const coords = L.Polyline.fromEncoded(track.map.summary_polyline).getLatLngs();

                        const newLine = L.polyline(
                            coords,
                            {
                                color: process.env.REACT_APP_TRACK_2015_COLOR,
                                weight: 2
                            }
                        );
                        
                        const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2015);
                    }
                }
                break;
            default:
                break;
        }
    }

    render() {
        return <div id='map' style={style} />
    }
}

const mapStateToProps = state => {
    const { accessToken, tracks, tracks2019, tracks2018, tracks2017, tracks2016, tracks2015,
        tracksLoaded2020, tracksLoaded2019, tracksLoaded2018, tracksLoaded2017, tracksLoaded2016, tracksLoaded2015,
        show2020Tracks, show2019Tracks, show2018Tracks, show2017Tracks, show2016Tracks, show2015Tracks } = state.tracksReducer;
    return {
        accessToken,
        tracks,
        tracks2019,
        tracks2018,
        tracks2017,
        tracks2016,
        tracks2015,
        tracksLoaded2020,
        tracksLoaded2019,
        tracksLoaded2018,
        tracksLoaded2017,
        tracksLoaded2016,
        tracksLoaded2015,
        show2020Tracks,
        show2019Tracks,
        show2018Tracks,
        show2017Tracks,
        show2016Tracks,
        show2015Tracks
    }
}

export default connect(mapStateToProps)(Map);