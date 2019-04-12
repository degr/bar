import React from 'react';
import DefaultLocations from '../utils/DefaultLocations';

export default class SitPosition extends React.Component {
    render() {
        const data = DefaultLocations[this.props.index];
        return <div style={{top: data.z*100, left: Math.abs(data.x*100)}}
                    className={"sit-position sit-position-" + this.props.index}
                    onClick={this.onClick}/>
    }

    onClick = () => {
        this.props.onClick(this.props.index);
    }
}
