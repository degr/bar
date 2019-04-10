import React from 'react';
import DefaultLocations from '../utils/DefaultLocations';

export default class SitPosition extends React.Component {
    render() {
        const data = DefaultLocations[this.props.index];
        return <div style={{left: data.x, top: data.y}}
                    className={"sit-position sit-position-" + this.props.index}
                    onClick={this.onClick}/>
    }

    onClick = () => {
        this.props.onClick(this.props.index);
    }
}
