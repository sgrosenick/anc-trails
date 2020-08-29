import React from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAccessToken, getActivities } from '../actions/actions';
import 'polyline-encoded';

const style = {
    width: '100%',
    height: '100vh'
};

const Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });

const tracksLayer = L.featureGroup();

const mapParams = {
    center: [61.160149, -149.96],
    zoomControl: false,
    zoom: 11.35,
    layers: [tracksLayer, Stadia_AlidadeSmoothDark]
}

class Map extends React.Component {
    static propTypes = {
        lastCompute: PropTypes.number,
        dbscanSettings: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        tracks: PropTypes.array,
        accessToken: PropTypes.string
      }

    componentDidMount() {
        const { dispatch } = this.props;

        this.map = L.map('map', mapParams);

        this.map.on('moveend', () => {
            //dispatch(doUpdateBoundingBox(this.map.getBounds()));
        });
        this.map.on('click', function(e) {
            tracksLayer.setStyle({color: "green", weight: 2});
        });
        
        tracksLayer.on('click', function(e) {
            const selectedId = e.layer._leaflet_id;

            tracksLayer.eachLayer(function(layer) {
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
            Tracks: tracksLayer
        }

        L.control.layers(baseMap, overlayMaps).addTo(this.map);

        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
    }

    componentDidUpdate(prevProps) {
        const { accessToken, dispatch, tracks, tracksLoaded2020, show2020Tracks } = this.props;

        if (accessToken !== "" && tracksLoaded2020 === false) {
            dispatch(getActivities({token: accessToken, year: 2020}))
        }

        if (tracksLoaded2020 === true && tracks !== prevProps.tracks) {
            this.addTracks();
        }

        if (show2020Tracks === false) {
            this.map.removeLayer(tracksLayer);
        } else {
            this.map.addLayer(tracksLayer);
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
                
                const distance = track.distance / 1609.344;
                const roundDistance = Math.round(distance * 100) / 100;
                const popupText = "<b>" + track.name + "</b><br><b>Miles: " + roundDistance + "</b>"; 
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
    const { accessToken, tracks, tracksLoaded2020, tracksLoaded2019, tracksLoaded2018, tracksLoaded2017, tracksLoaded2016, tracksLoaded2015, show2020Tracks } = state.tracksReducer;
    return {
        accessToken,
        tracks,
        tracksLoaded2020,
        tracksLoaded2019,
        tracksLoaded2018,
        tracksLoaded2017,
        tracksLoaded2016,
        tracksLoaded2015,
        show2020Tracks
    }
}

export default connect(mapStateToProps)(Map);