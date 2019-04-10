import React, { Component } from 'react';
import './App.css';
import Canvas from "./canvas/Canvas";
import Map from "./components/Map";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: null
        }
    }

  render() {
    return (
      <div>
          <Map onLocationChange={location => this.setState({location: location})}/>
          <Canvas location={this.state.location}/>
      </div>
    );
  }
}

export default App;
