import React, { Component } from 'react';
import './App.css';
import Canvas from "./canvas/Canvas";
import Map from "./components/Map";

class App extends Component {


  render() {
    return (
      <div>
          <Map/>
          <Canvas/>
      </div>
    );
  }
}

export default App;
