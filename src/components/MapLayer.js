import React, { Component } from "react";
import "../App.css";
import { Map, TileLayer, Marker, GeoJSON } from "react-leaflet";
import L from "leaflet";

var myIcon = L.icon({
  iconUrl:
    "https://cdn1.iconfinder.com/data/icons/maps-and-location-v2/64/location_pin_gps-512.png",
  iconSize: [29, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
});

class MapLayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        lat: 51.505,
        lng: -0.09
      },
      zoom: 2,
      bikes: [],
      haveUsersLocation: false,
      map: null,
      geojsonLayer: null
    };
  }
  //using geolocation to find the location of the user
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          haveUsersLocation: true,
          zoom: 13
        });
      },
      () => {
        // IF the user disagrees to share location, API to find nearby location using IP address
        fetch("https://ipapi.co/json")
          .then(response => response.json())
          .then(location =>
            this.setState({
              location: {
                lat: location.latitude,
                lng: location.longitude
              },
              haveUsersLocation: true,
              zoom: 13
            })
          );
      }
    );
  }
  // get bike incident data and store in state
  componentWillMount() {
    fetch("https://bikewise.org:443/api/v2/locations?proximity_square=100")
      .then(response => response.json())
      .then(data => this.setState({ haveUsersLocation: true, bikes: data }));
  }
  render() {
    const position = [this.state.location.lat, this.state.location.lng];

    return (
      <div>
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Able to a add GeoJSON data but unable to load to map layer */}
          <GeoJSON addData={this.state.bikes} />

          {this.state.haveUsersLocation ? (
            <Marker position={position} icon={myIcon} />
          ) : (
            ""
          )}
        </Map>
      </div>
    );
  }
}

export default MapLayer;
