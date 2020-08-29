import React from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAccessToken, getActivities, SHOW_2019_TRACKS } from '../actions/actions';
import 'polyline-encoded';

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

const mapParams = {
    center: [61.160149, -149.96],
    zoomControl: false,
    zoom: 11.35,
    layers: [tracksLayer2020, tracksLayer2019, Stadia_AlidadeSmoothDark]
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
            tracksLayer2020.setStyle({color: "green", weight: 2});
        });
        
        tracksLayer2020.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer2020.eachLayer(function(layer) {
                console.log("Layer: " + layer);
                layer.setStyle({color: "green", weight: 2});
                if (layer._leaflet_id === selectedId) {
                    console.log("found it");
                    layer.setStyle({color: "blue", weight: 4});
                    layer.bringToFront();
                }
            })
        });

        dispatch(getAccessToken());

        const baseMap = {
            'Stadia Alidade Smooth Dark': Stadia_AlidadeSmoothDark
        }

        const overlayMaps = {
            Tracks: tracksLayer2020
        }

        L.control.layers(baseMap, overlayMaps).addTo(this.map);

        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
    }

    componentDidUpdate(prevProps) {
        const { accessToken, dispatch, tracks, tracks2019, tracksLoaded2020, tracksLoaded2019, show2020Tracks, show2019Tracks } = this.props;

        if (accessToken !== "" && tracksLoaded2020 === false) {
            dispatch(getActivities({token: accessToken, year: 2020}))
        }

        if (accessToken !== "" && tracksLoaded2020 === true && tracksLoaded2019 === false) {
            dispatch(getActivities({token: accessToken, year: 2019}))
        }

        if (tracksLoaded2020 === true && tracks !== prevProps.tracks) {
            this.addTracks(2020);
        }

        if (tracksLoaded2019 === true && tracks2019 !== prevProps.tracks2019) {
            this.addTracks(2019);
        }

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
                                color: "green",
                                weight: 2
                            }
                        );
                
                        const distance = track.distance / 1609.344;
                        const roundDistance = Math.round(distance * 100) / 100;
                        const popupText = "<b>2020 Track</b><br><b>" + track.name + "</b><br><b>Miles: " + roundDistance + "</b>"; 
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
                                color: "orange",
                                weight: 2
                            }
                        );
                
                        const distance = track.distance / 1609.344;
                        const roundDistance = Math.round(distance * 100) / 100;
                        const popupText = "<b>2019 Track</b><br><b>" + track.name + "</b><br><b>Miles: " + roundDistance + "</b>"; 
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2019);
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
    const { accessToken, tracks, tracks2019, tracksLoaded2020, tracksLoaded2019, tracksLoaded2018, tracksLoaded2017, tracksLoaded2016, tracksLoaded2015, show2020Tracks, show2019Tracks } = state.tracksReducer;
    return {
        accessToken,
        tracks,
        tracks2019,
        tracksLoaded2020,
        tracksLoaded2019,
        tracksLoaded2018,
        tracksLoaded2017,
        tracksLoaded2016,
        tracksLoaded2015,
        show2020Tracks,
        show2019Tracks
    }
}

export default connect(mapStateToProps)(Map);