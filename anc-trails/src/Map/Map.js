import React from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAccessToken, getActivities, uploadTracks, runAnalysis, SHOW_2019_TRACKS } from '../actions/actions';
import { popupStyle } from './Popup';
import { buffer, intersect } from '@turf/turf';
import shortid from 'shortid';
//import { intersect } from '@turf/intersect';
import 'polyline-encoded';
import "../style/popup.scss"
//import { intersect } from '@turf/intersect';

const style = {
    width: '100%',
    height: '100vh'
};

const Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });

const tracksLayer2021 = L.featureGroup();
const tracksLayer2020 = L.featureGroup();
const tracksLayer2019 = L.featureGroup();
const tracksLayer2018 = L.featureGroup();
const tracksLayer2017 = L.featureGroup();
const tracksLayer2016 = L.featureGroup();
const tracksLayer2015 = L.featureGroup();
const streetsLayer = L.featureGroup();
const bufferedTracks = L.featureGroup();
const bufferedStreets = L.featureGroup();
const riddenStreets = L.featureGroup();


const mapParams = {
    center: [61.166, -149.90],
    zoomControl: false,
    zoom: 11.49,
    layers: [tracksLayer2021, tracksLayer2020, tracksLayer2019, tracksLayer2018, tracksLayer2017, tracksLayer2016, tracksLayer2015, streetsLayer, riddenStreets, Stadia_AlidadeSmoothDark]
}

class Map extends React.Component {
    static propTypes = {
        lastCompute: PropTypes.number,
        dbscanSettings: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        tracks: PropTypes.array,
        streets: PropTypes.array,
        tracks2019: PropTypes.array,
        accessToken: PropTypes.string
    }

    componentDidMount() {
        const { dispatch } = this.props;

        this.map = L.map('map', mapParams);

        let allLayers = [tracksLayer2021, tracksLayer2020, tracksLayer2019, tracksLayer2018, tracksLayer2017, tracksLayer2016, tracksLayer2015];

        this.map.on('click', function(e) {
            tracksLayer2021.setStyle({color: process.env.REACT_APP_TRACK_2021_COLOR, weight: 2});
            tracksLayer2020.setStyle({color: process.env.REACT_APP_TRACK_2020_COLOR, weight: 2});
            tracksLayer2019.setStyle({color: process.env.REACT_APP_TRACK_2019_COLOR, weight: 2});
            tracksLayer2018.setStyle({color: process.env.REACT_APP_TRACK_2018_COLOR, weight: 2});
            tracksLayer2017.setStyle({color: process.env.REACT_APP_TRACK_2017_COLOR, weight: 2});
            tracksLayer2016.setStyle({color: process.env.REACT_APP_TRACK_2016_COLOR, weight: 2});
            tracksLayer2015.setStyle({color: process.env.REACT_APP_TRACK_2015_COLOR, weight: 2});
        });

        function deemphasizeLayers() {

            allLayers.forEach(layer => {
                if(layer._map != null) {
                    layer.eachLayer(lyr => {
                        let newColor; 
                        
                        switch(lyr.options.color) {
                            case process.env.REACT_APP_TRACK_2021_COLOR:
                                newColor = process.env.REACT_APP_TRACK_2021_DEEMPHASIZE;
                                break;
                            case process.env.REACT_APP_TRACK_2020_COLOR:
                                newColor = process.env.REACT_APP_TRACK_2020_DEEMPHASIZE;
                                break;
                            case process.env.REACT_APP_TRACK_2019_COLOR:
                                newColor = process.env.REACT_APP_TRACK_2019_DEEMPHASIZE;
                                break;
                            case process.env.REACT_APP_TRACK_2018_COLOR:
                                newColor = process.env.REACT_APP_TRACK_2018_DEEMPHASIZE;
                                break;
                            case process.env.REACT_APP_TRACK_2017_COLOR:
                                newColor = process.env.REACT_APP_TRACK_2017_DEEMPHASIZE;
                                break;
                            case process.env.REACT_APP_TRACK_2016_COLOR:
                                newColor = process.env.REACT_APP_TRACK_2016_DEEMPHASIZE;
                                break;
                            case process.env.REACT_APP_TRACK_2015_COLOR:
                                newColor = process.env.REACT_APP_TRACK_2015_DEEMPHASIZE;
                                break;
                            default:
                                console.log("no match");
                                break;
                        }

                        lyr.setStyle({color: newColor, weight: 2});
                    })
                }
                console.log('hi');
            });
        };

        tracksLayer2021.on('click', function(e) {
            deemphasizeLayers();
            const selectedId = e.layer._leaflet_id;

            tracksLayer2021.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2021_COLOR, weight: 2});

                if (layer._leaflet_id != selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_2021_DEEMPHASIZE, weight: 2});
                }
            });

            tracksLayer2021.getLayer(selectedId).setStyle({color: process.env.REACT_APP_TRACK_2021_HIGHLIGHT, weight: 4}).bringToFront();
        });
        
        tracksLayer2020.on('click', function(e) {
            deemphasizeLayers();
            const selectedId = e.layer._leaflet_id;

            tracksLayer2020.eachLayer(function(layer) {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2020_COLOR, weight: 2});

                if (layer._leaflet_id != selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_2020_DEEMPHASIZE, weight: 2});
                }
            });

            tracksLayer2020.getLayer(selectedId).setStyle({color: process.env.REACT_APP_TRACK_2020_HIGHLIGHT, weight: 4}).bringToFront();
        });

        tracksLayer2019.on('click', function(e) {
            deemphasizeLayers();
            const selectedId = e.layer._leaflet_id;
            tracksLayer2019.eachLayer(layer => {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2019_COLOR, weight: 2});

                if (layer._leaflet_id !== selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_2019_DEEMPHASIZE, weight: 2});
                }
            });

            tracksLayer2019.getLayer(selectedId).setStyle({color: process.env.REACT_APP_TRACK_2019_HIGHLIGHT, weight: 4}).bringToFront();
        });

        tracksLayer2018.on('click', function(e) {
            deemphasizeLayers();
            const selectedId = e.layer._leaflet_id;

            tracksLayer2018.eachLayer(layer => {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2018_COLOR, weight: 2});

                if (layer._leaflet_id !== selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_2018_DEEMPHASIZE, weight: 2});
                }
            });

            tracksLayer2018.getLayer(selectedId).setStyle({color: process.env.REACT_APP_TRACK_2018_HIGHLIGHT, weight: 4}).bringToFront();
        });

        tracksLayer2017.on('click', function(e) {
            deemphasizeLayers();
            const selectedId = e.layer._leaflet_id;

            tracksLayer2017.eachLayer(layer => {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2017_COLOR, weight: 2});

                if (layer._leaflet_id !== selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_2017_DEEMPHASIZE, weight: 2});
                }
            });

            tracksLayer2017.getLayer(selectedId).setStyle({color: process.env.REACT_APP_TRACK_2017_HIGHLIGHT, weight: 4}).bringToFront();
        });

        tracksLayer2016.on('click', function(e) {
            deemphasizeLayers();
            const selectedId = e.layer._leaflet_id;

            tracksLayer2016.eachLayer(layer => {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2016_COLOR, weight: 2});

                if (layer._leaflet_id !== selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_2016_DEEMPHASIZE, weight: 2});
                }
            });

            tracksLayer2016.getLayer(selectedId).setStyle({color: process.env.REACT_APP_TRACK_2016_HIGHLIGHT, weight: 4}).bringToFront();
        });

        tracksLayer2015.on('click', function(e) {
            deemphasizeLayers();
            const selectedId = e.layer._leaflet_id;

            tracksLayer2015.eachLayer(layer => {
                layer.setStyle({color: process.env.REACT_APP_TRACK_2015_COLOR, weight: 2});

                if (layer._leaflet_id !== selectedId) {
                    layer.setStyle({color: process.env.REACT_APP_TRACK_2015_DEEMPHASIZE, weight: 2});
                }
            });

            tracksLayer2015.getLayer(selectedId).setStyle({color: process.env.REACT_APP_TRACK_2015_HIGHLIGHT, weight: 4}).bringToFront();
        });

        dispatch(getAccessToken());

        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
    }

    componentDidUpdate(prevProps) {
        const { accessToken, dispatch, tracks, streets, analysisRunning, tracks2021, tracks2019, tracks2018, tracks2017, tracks2016, tracks2015,
            streetsLoaded, tracksUploading, tracksLoaded2021, tracksLoaded2020, tracksLoaded2019, tracksLoaded2018, tracksLoaded2017, tracksLoaded2016, tracksLoaded2015,
            show2021Tracks, show2020Tracks, show2019Tracks, show2018Tracks, show2017Tracks, show2016Tracks, show2015Tracks } = this.props;

        // STREETS LOADED

        if (streetsLoaded === true) {
            this.addStreets();
        }

        if (analysisRunning === true) {
            this.analysis();
        }

        // TRACKS LOADED
        if (accessToken !== "" && tracksLoaded2021 === false) {
            dispatch(getActivities({token: accessToken, year: 2021}))
        }

        if (accessToken !== "" && tracksLoaded2021 === true && tracksLoaded2020 === false) {
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

        // UPLOAD TRACKS

        if (tracksUploading !== false) {
            this.uploadTracks();
        }

        // ADD TRACKS
        if (tracksLoaded2021 === true && tracks2021 !== prevProps.tracks2021) {
            this.addTracks(2021);
        }

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
        if (show2021Tracks === false) {
            this.map.removeLayer(tracksLayer2021);
        } else {
            this.map.addLayer(tracksLayer2021);
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

    addStreets() {
        streetsLayer.clearLayers();

                const { streets } = this.props;

                for (const street in streets) {

                    if (streets.hasOwnProperty(street)) {

                        const streetObj = streets[street];
                        const geometry = JSON.parse(streetObj.st_asgeojson);

                        var newGeoJson = {};
                        newGeoJson.type = "Feature";
                        newGeoJson.properties = {
                            street_id: streetObj.objectid,
                            name: streetObj.street_nam,
                            type: streetObj.street_sym
                        };
                        newGeoJson.geometry = geometry;

                        var style = {
                            "color": "#dfe6e9",
                            "weight": 0.8
                        };

                        const newLine = L.geoJSON(newGeoJson, { style });

                
                        newLine.addTo(streetsLayer);
                    }
                }
    
    }

    analysis() {
        const { streets } = this.props;

        tracksLayer2020.eachLayer(function(layer) {
            var geojson = layer.toGeoJSON();

            var buffered = buffer(geojson, 12, {units: 'feet'});

            const bufferedLine = L.geoJSON(buffered, {
                "color": "yellow"
            });
            bufferedLine.addTo(bufferedTracks);
        });

        streetsLayer.eachLayer(function(layer) {
            var geojson = layer.toGeoJSON();

            var buffered = buffer(geojson, 12, { units: 'feet' });
            buffered.properties = geojson.features[0].properties;

            const bufferedLine = L.geoJSON(buffered, {
                "color": "orange"
            });
            bufferedLine.addTo(bufferedStreets);
        });

        bufferedStreets.eachLayer(function(layer) {
            var geoJSONStreet = layer.toGeoJSON();

            bufferedTracks.eachLayer(function(tracksLayer) {
                var geoJSONTracks = tracksLayer.toGeoJSON();

                var streetsGeometry = geoJSONStreet.features[0].geometry;
                var tracksGeometry = geoJSONTracks.features[0].geometry;
                
                try {
                    var intersectStreets = intersect(streetsGeometry, tracksGeometry);

                    if (intersectStreets != null) {
                        console.log(intersectStreets);

                        layer.addTo(riddenStreets);
                    }

                } catch(error) {
                    console.log(error)
                }

                console.log(intersectStreets);
            });
        });

    }

    uploadTracks() {
        const { dispatch } = this.props;

        var newTracks = [];

        var layers = [tracksLayer2021, tracksLayer2020, tracksLayer2019, tracksLayer2018, tracksLayer2017, tracksLayer2016,  tracksLayer2015];

        for (var i = 0; i < layers.length; i++) {
            console.log(layers[i].year);
            layers[i].eachLayer(function(layer) {
                var geoJSON = layer.toGeoJSON();
    
                var newGeom = {};
                var type = geoJSON.features[0].geometry.type;
                var coords = geoJSON.features[0].geometry.coordinates;
                newGeom.alpha = type;
                newGeom.coordinates = coords;
                var coordinates = '"' + coords + '"';
                var stringifed = JSON.stringify(newGeom);

                var newLayer = {};
                newLayer.id = shortid.generate();
                newLayer.average_speed = geoJSON.features[0].properties.average_speed;
                newLayer.max_speed = geoJSON.features[0].properties.max_speed;
                newLayer.name = geoJSON.features[0].properties.name;
                newLayer.distance = geoJSON.features[0].properties.distance;
                newLayer.moving_time = geoJSON.features[0].properties.moving_time;
                newLayer.start_date_local = geoJSON.features[0].properties.start_date_local;
                newLayer.total_elevation_gain = geoJSON.features[0].properties.total_elevation_gain;
                newLayer.type = geoJSON.features[0].properties.type;
                newLayer.year = geoJSON.features[0].properties.year;
                newLayer.achievement_count = geoJSON.features[0].properties.achievement_count;
                newLayer.geometry = newGeom;
                newLayer.pr_count = geoJSON.features[0].properties.pr_count;
                //newLayer.geom_type = type;
                //newLayer.geom_coords = coordinates;
                newLayer.max_heartrate = geoJSON.features[0].properties.max_heartrate;
                newLayer.average_heartrate = geoJSON.features[0].properties.average_heartrate;

                // var newLayer = "('" + shortid.generate() + "', " + geoJSON.features[0].properties.average_speed + ", "
                //                  + geoJSON.features[0].properties.max_speed + ", '"
                //                  + geoJSON.features[0].properties.name + "', "
                //                  + geoJSON.features[0].properties.distance + ", "
                //                  + geoJSON.features[0].properties.moving_time + ", '"
                //                  + geoJSON.features[0].properties.start_date_local + "', "
                //                  + geoJSON.features[0].properties.total_elevation_gain + ", '"
                //                  + geoJSON.features[0].properties.type + "', "
                //                  + geoJSON.features[0].properties.achievement_count + ", '"
                //                  + stringifed +
                //                  "')";
                
                
                newTracks.push(newLayer);
            });
            console.log("tracks total: " + newTracks.length);
            console.log(layers[i].length);
        }
 
        var jsonTracks = JSON.stringify(newTracks);
        console.log(jsonTracks);
        //dispatch(uploadTracks(jsonTracks));
        //var jsonArray = JSON.stringify({ ...newTracks });
        //console.log('hi');
    }

    addTracks(year) {

        switch(year) {
            case 2021:
                tracksLayer2021.clearLayers();

                const { tracks2021 } = this.props;

                console.log("2021 Track Total: " + tracks2021.length);

                let totalMiles2021 = 0; 

                for (const track of tracks2021) {
                    if (track.type === "Ride") {
                        const coords = L.Polyline.fromEncoded(track.map.summary_polyline).getLatLngs();
                        const newLine = L.polyline(
                            coords,
                            {
                                color: process.env.REACT_APP_TRACK_2021_COLOR,
                                weight: 2
                            }
                        );

                        var style = {
                            "color": process.env.REACT_APP_TRACK_2021_COLOR,
                            "weight": 2
                        };
                        
                        const distance = track.distance / 1609.344;
                        const roundDistance = Math.round(distance * 100) / 100;
                        totalMiles2021 += roundDistance;

                        const convertToGeojson = newLine.toGeoJSON();
                        convertToGeojson.properties = {
                            average_speed: track.average_speed,
                            max_speed: track.max_speed,
                            name: track.name,
                            distance: track.distance,
                            moving_time: track.moving_time,
                            start_date_local: track.start_date_local,
                            total_elevation_gain: track.total_elevation_gain,
                            type: track.type,
                            year: 2021,
                            achievement_count: track.achievement_count,
                            pr_count: track.pr_count,
                            max_heartrate: track.max_heartrate,
                            average_heartrate: track.average_heartrate
                        };

                        const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2021);
                    }
                }

                console.log("2021 Miles: " + totalMiles2021);

                break;
            case 2020:
                tracksLayer2020.clearLayers();

                const { tracks } = this.props;

                console.log("2020 Track Total: " + tracks.length);

                let totalMiles2020 = 0;

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

                        var style = {
                            "color": process.env.REACT_APP_TRACK_2020_COLOR,
                            "weight": 2
                        };

                        const distance = track.distance / 1609.344;
                        const roundDistance = Math.round(distance * 100) / 100;
                        totalMiles2020 += roundDistance;
                        
                        const convertToGeojson = newLine.toGeoJSON();
                        convertToGeojson.properties = {
                            average_speed: track.average_speed,
                            max_speed: track.max_speed,
                            name: track.name,
                            distance: track.distance,
                            moving_time: track.moving_time,
                            start_date_local: track.start_date_local,
                            total_elevation_gain: track.total_elevation_gain,
                            type: track.type,
                            year: 2020,
                            achievement_count: track.achievement_count,
                            pr_count: track.pr_count,
                            max_heartrate: track.max_heartrate,
                            average_heartrate: track.average_heartrate
                        };
                        
                        const newTrack = L.geoJSON(convertToGeojson, { style });

                        const popupText = popupStyle(track);
                        //newTrack.bindPopup(popupText);
                        //newTrack.addTo(tracksLayer2020);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2020);
                    }
                }

                console.log("2020 Miles: " + totalMiles2020);

                break;
            case 2019:
                tracksLayer2019.clearLayers();

                const { tracks2019 } = this.props;

                console.log("2019 Track Total: " + tracks2019.length);

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

                        var style = {
                            "color": process.env.REACT_APP_TRACK_2019_COLOR,
                            "weight": 2
                        };
                        
                        const convertToGeojson = newLine.toGeoJSON();
                        convertToGeojson.properties = {
                            average_speed: track.average_speed,
                            max_speed: track.max_speed,
                            name: track.name,
                            distance: track.distance,
                            moving_time: track.moving_time,
                            start_date_local: track.start_date_local,
                            total_elevation_gain: track.total_elevation_gain,
                            type: track.type,
                            year: 2019,
                            achievement_count: track.achievement_count,
                            pr_count: track.pr_count,
                            max_heartrate: track.max_heartrate,
                            average_heartrate: track.average_heartrate
                        };
                        
                        const newTrack = L.geoJSON(convertToGeojson, { style });

                        const popupText = popupStyle(track);
                        //newTrack.bindPopup(popupText);
                        //newTrack.addTo(tracksLayer2019);


                        // const newLine = L.polyline(
                        //     coords,
                        //     {
                        //         color: process.env.REACT_APP_TRACK_2019_COLOR,
                        //         weight: 2
                        //     }
                        // );
                        
                        // const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2019);
                    }
                }
                break;
            case 2018:
                tracksLayer2018.clearLayers();

                const { tracks2018 } = this.props;

                console.log("2018 Track Total: " + tracks2018.length);

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

                        var style = {
                            "color": process.env.REACT_APP_TRACK_2018_COLOR,
                            "weight": 2
                        };
                        
                        const convertToGeojson = newLine.toGeoJSON();
                        convertToGeojson.properties = {
                            average_speed: track.average_speed,
                            max_speed: track.max_speed,
                            name: track.name,
                            distance: track.distance,
                            moving_time: track.moving_time,
                            start_date_local: track.start_date_local,
                            total_elevation_gain: track.total_elevation_gain,
                            type: track.type,
                            year: 2018,
                            achievement_count: track.achievement_count,
                            pr_count: track.pr_count,
                            max_heartrate: track.max_heartrate,
                            average_heartrate: track.average_heartrate
                        };
                        
                        const newTrack = L.geoJSON(convertToGeojson, { style });

                        const popupText = popupStyle(track);
                        //newTrack.bindPopup(popupText);
                        //newTrack.addTo(tracksLayer2018);


                        // const newLine = L.polyline(
                        //     coords,
                        //     {
                        //         color: process.env.REACT_APP_TRACK_2018_COLOR,
                        //         weight: 2
                        //     }
                        // );
            
                        // const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2018);
                    }
                }
                break;
            case 2017:
                tracksLayer2017.clearLayers();

                const { tracks2017 } = this.props;

                console.log("2017 Track Total: " + tracks2017.length);

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

                        var style = {
                            "color": process.env.REACT_APP_TRACK_2017_COLOR,
                            "weight": 2
                        };
                        
                        const convertToGeojson = newLine.toGeoJSON();
                        convertToGeojson.properties = {
                            average_speed: track.average_speed,
                            max_speed: track.max_speed,
                            name: track.name,
                            distance: track.distance,
                            moving_time: track.moving_time,
                            start_date_local: track.start_date_local,
                            total_elevation_gain: track.total_elevation_gain,
                            type: track.type,
                            year: 2017,
                            achievement_count: track.achievement_count,
                            pr_count: track.pr_count,
                            max_heartrate: track.max_heartrate,
                            average_heartrate: track.average_heartrate
                        };
                        
                        const newTrack = L.geoJSON(convertToGeojson, { style });

                        const popupText = popupStyle(track);
                        //newTrack.bindPopup(popupText);
                        //newTrack.addTo(tracksLayer2017);


                        // const newLine = L.polyline(
                        //     coords,
                        //     {
                        //         color: process.env.REACT_APP_TRACK_2017_COLOR,
                        //         weight: 2
                        //     }
                        // );
            
                        // const popupText = popupStyle(track);
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2017);
                    }
                }
                break;
            case 2016:
                tracksLayer2016.clearLayers();

                const { tracks2016 } = this.props;

                console.log("2016 Track Total: " + tracks2016.length);

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

                        var style = {
                            "color": process.env.REACT_APP_TRACK_2016_COLOR,
                            "weight": 2
                        };
                        
                        const convertToGeojson = newLine.toGeoJSON();
                        convertToGeojson.properties = {
                            average_speed: track.average_speed,
                            max_speed: track.max_speed,
                            name: track.name,
                            distance: track.distance,
                            moving_time: track.moving_time,
                            start_date_local: track.start_date_local,
                            total_elevation_gain: track.total_elevation_gain,
                            type: track.type,
                            year: 2016,
                            achievement_count: track.achievement_count,
                            pr_count: track.pr_count,
                            max_heartrate: track.max_heartrate,
                            average_heartrate: track.average_heartrate
                        };
                        
                        const newTrack = L.geoJSON(convertToGeojson, { style });

                        const popupText = popupStyle(track);
                        //newTrack.bindPopup(popupText);
                        //newTrack.addTo(tracksLayer2016);


                        // const newLine = L.polyline(
                        //     coords,
                        //     {
                        //         color: process.env.REACT_APP_TRACK_2016_COLOR,
                        //         weight: 2
                        //     }
                        // );
                
                        // const popupText = popupStyle(track); 
                        newLine.bindPopup(popupText);
                        newLine.addTo(tracksLayer2016);
                    }
                }
                break;
            case 2015:
                tracksLayer2015.clearLayers();

                const { tracks2015 } = this.props;

                console.log("2015 Track Total: " + tracks2015.length);

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

                        var style = {
                            "color": process.env.REACT_APP_TRACK_2015_COLOR,
                            "weight": 2
                        };
                        
                        const convertToGeojson = newLine.toGeoJSON();
                        convertToGeojson.properties = {
                            average_speed: track.average_speed,
                            max_speed: track.max_speed,
                            name: track.name,
                            distance: track.distance,
                            moving_time: track.moving_time,
                            start_date_local: track.start_date_local,
                            total_elevation_gain: track.total_elevation_gain,
                            type: track.type,
                            year: 2015,
                            achievement_count: track.achievement_count,
                            pr_count: track.pr_count,
                            max_heartrate: track.max_heartrate,
                            average_heartrate: track.average_heartrate
                        };
                        
                        const newTrack = L.geoJSON(convertToGeojson, { style });

                        const popupText = popupStyle(track);
                        //newTrack.bindPopup(popupText);
                        //newTrack.addTo(tracksLayer2015);


                        // const newLine = L.polyline(
                        //     coords,
                        //     {
                        //         color: process.env.REACT_APP_TRACK_2015_COLOR,
                        //         weight: 2
                        //     }
                        // );
                        
                        // const popupText = popupStyle(track);
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
    const { accessToken, tracks, analysisRunning, streets, tracks2021, tracks2019, tracks2018, tracks2017, tracks2016, tracks2015,
        streetsLoaded, tracksUploading, tracksLoaded2021, tracksLoaded2020, tracksLoaded2019, tracksLoaded2018, tracksLoaded2017, tracksLoaded2016, tracksLoaded2015,
        show2021Tracks, show2020Tracks, show2019Tracks, show2018Tracks, show2017Tracks, show2016Tracks, show2015Tracks } = state.tracksReducer;
    return {
        accessToken,
        tracks,
        streets,
        analysisRunning,
        tracks2021,
        tracks2019,
        tracks2018,
        tracks2017,
        tracks2016,
        tracks2015,
        streetsLoaded,
        tracksUploading,
        tracksLoaded2021,
        tracksLoaded2020,
        tracksLoaded2019,
        tracksLoaded2018,
        tracksLoaded2017,
        tracksLoaded2016,
        tracksLoaded2015,
        show2021Tracks,
        show2020Tracks,
        show2019Tracks,
        show2018Tracks,
        show2017Tracks,
        show2016Tracks,
        show2015Tracks
    }
}

export default connect(mapStateToProps)(Map);