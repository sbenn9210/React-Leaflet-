import React, { Component } from "react";
import "./App.css";
import { Map, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

var myIcon = L.icon({
  iconUrl:
    "https://cdn1.iconfinder.com/data/icons/maps-and-location-v2/64/location_pin_gps-512.png",
  iconSize: [29, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
});

class App extends Component {
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

    // this.onEachFeature = this.onEachFeature.bind(this);
    // this.pointToLayer = this.pointToLayer.bind(this);
    // this.filterFeatures = this.filterFeatures.bind(this);
    // this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
  }

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

  componentWillMount() {
    fetch(
      "https://bikewise.org:443/api/v2/locations/markers?proximity_square=10"
    )
      .then(response => response.json())
      .then(data => this.setState({ bikes: data }));
  }

  onEachFeature(feature, layer) {
    const popupContent = `<h5>${
      feature.type.geometry.properties.title
    }</h5> <p>${feature.geometry.properties.occured_at}</p>`;
    layer.bindPopup(popupContent);
  }

  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    // const geojsonLayer = L.geoJSON(this.state.bikes, {}).addTo(this.state.map);

    return (
      <div className="App">
        <Menu />
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* <GeoJSON addData={this.state.bikes} /> */}

          {this.state.haveUsersLocation ? (
            <Marker position={position} icon={myIcon} />
          ) : (
            ""
          )}
          {/* {this.state.bikes.features.map(bike => (
            <Marker
              position={[
                bike.features.geometry.coordinates[0],
                bike.features.geometry.coordinates[1]
              ]}
              icon={myIcon}
            >
              <Popup>Your current location</Popup>
            </Marker>
          ))} */}
        </Map>
      </div>
    );
  }
}

export default App;

class Menu extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">ReactMaps</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">Add Data</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">
                  Cluster Data
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
