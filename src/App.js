import React, { Component } from "react";
import "./App.css";
import MapLayer from "./components/MapLayer";
import Menu from "./components/Menu";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Menu />
        <MapLayer />
      </div>
    );
  }
}

export default App;
