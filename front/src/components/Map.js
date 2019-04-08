import React from 'react';
import './Map.scss';

export default class Map extends React.Component {
    render() {
        return <div className="bar-map" onClick={this.onMapClick}>MAP HERE</div>;
    }

    onMapClick = () => {
        alert("on map click");
    }
}