import React from 'react';
import DefaultLocations from '../utils/DefaultLocations';

export default class SitPosition extends React.Component {
    render() {
        const data = DefaultLocations[this.props.index];
        //return <div style={{left: Math.abs(data.x*200)}}
        return <div style={{top: data.z*80, left: Math.abs(data.x*80) + 200}}
                    className={"sit-position sit-position-" + this.props.index}
                    onClick={this.onClick}/>
    }

    onClick = () => {
        this.props.onClick(this.props.index);
    }
}
