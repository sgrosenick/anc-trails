import React from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doUpdateBoundingBox, getAccessToken, getActivities } from '../actions/actions';
import 'polyline-encoded';

const style = {
    width: '100%',
    height: '100vh'
};

const Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });

const placesLayer = L.featureGroup();
const clusterLayer = L.featureGroup();
const tracksLayer = L.featureGroup();

const mapParams = {
    center: [61.160149, -149.96],
    zoomControl: false,
    zoom: 11.35,
    layers: [placesLayer, clusterLayer, tracksLayer, Stadia_AlidadeSmoothDark]
}

class Map extends React.Component {
    static propTypes = {
        lastCall: PropTypes.number,
        lastCompute: PropTypes.number,
        dbscanSettings: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        places: PropTypes.object,
        tracks: PropTypes.array,
        accessToken: PropTypes.string
      }

    componentDidMount() {
        const { dispatch } = this.props;

        this.map = L.map('map', mapParams);

        this.map.on('moveend', () => {
            //dispatch(doUpdateBoundingBox(this.map.getBounds()));
        });

        //dispatch(doUpdateBoundingBox(this.map.getBounds()));
        dispatch(getAccessToken());
        //this.addTracks();

        const clusterPane = this.map.createPane('clusterPane');
        clusterPane.style.opacity = 0.9;

        const baseMap = {
            'Stadia Alidade Smooth Dark': Stadia_AlidadeSmoothDark
        }

        const overlayMaps = {
            'Points of interest': placesLayer,
            Clusters: clusterLayer,
            Tracks: tracksLayer
        }

        L.control.layers(baseMap, overlayMaps).addTo(this.map);

        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
    }

    componentDidUpdate(prevProps) {
        const { lastCall, accessToken, dispatch, tracks, tracksLoaded } = this.props;
        // check if timestap is later
        if (lastCall > prevProps.lastCall) {
            // if so, data has been updated
            this.addPlaces();
            //this.addTracks();
        }

        if (accessToken != "" && tracksLoaded == false) {
            dispatch(getActivities({token: accessToken}))
        }

        if (tracksLoaded == true && tracks != prevProps.tracks) {
            this.addTracks();
        }
    }

    addPlaces() {
        // clear layers
        placesLayer.clearLayers();

        const { places } = this.props;
        let cnt = 0;

        for (const place of places) {
            if (places[place].hasOwnProperty('data') && places[place].data.length > 0) {
                // for (const placeObj of places[place].data) {
                //     L.circleMarker([placeObj.position[0], placeObj.position[1]], {
                //         color: places[place].color,
                //         orig_color: places[place].color,
                //         radius: 5,
                //         id: cnt,
                //         weight: 1,
                //         opacity: 0.5
                //     }).addTo(placesLayer).bindTooltip(placeObj.title)
                //     cnt += 1;
                // }
                console.log(place.type);
            }
        }
    }

    addTracks() {
        tracksLayer.clearLayers();

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

                const popupText = "<b>" + track.name + "</b>";
                newLine.bindPopup(popupText);
                newLine.addTo(tracksLayer);
            }
        }
    }

    render() {
        return <div id='map' style={style} />
    }
}

const mapStateToProps = state => {
    const { places, lastCall, accessToken, tracks, tracksLoaded } = state.placesControls;
    return {
        places,
        lastCall,
        accessToken,
        tracks,
        tracksLoaded
    }
}

export default connect(mapStateToProps)(Map);