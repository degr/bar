import React from 'react';
import './Map.scss';

export default class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showMap: false
        }
    }


    render() {
        return<div>
            <button className="ui" onClick={this.showMap}>Show Map</button>

            {this.state.showMap &&

            <div className="bar-map">MAP HERE
                <div id="P1" onClick={this.onPlaceClick1}></div>
                <div id="P2" onClick={this.onPlaceClick2}></div>
                <div id="P3" onClick={this.onPlaceClick3}></div>
                <div id="P4" onClick={this.onPlaceClick4}></div>
                <div id="P5" onClick={this.onPlaceClick5}></div>
                <div id="P6" onClick={this.onPlaceClick6}></div>
                <div id="P7" onClick={this.onPlaceClick7}></div>
                <div id="P8" onClick={this.onPlaceClick8}></div>
                <div id="P9" onClick={this.onPlaceClick9}></div>
                <div id="P10" onClick={this.onPlaceClick10}></div>
            </div>
            }
        </div>

    }
    showMap = () => {
        this.setState({showMap: true});
    }

    onPlaceClick1 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick2 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick3 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick4 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick5 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick6 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick7 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick8 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick9 = () => {
        this.setState({showMap: false});
    }
    onPlaceClick10 = () => {
        this.setState({showMap: false});
    }


}