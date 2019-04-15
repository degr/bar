import React from 'react';
import './Map.scss';
import SitPosition from './SitPosition';

export default class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showMap: false
        }
    }


    render() {
        const sitPositions = [];
        for(let i = 0; i < 10; i++) {
            sitPositions.push(<SitPosition key={i} index={i} onClick={this.onClick}/>)
        }
        return<div>
            <button className="btn_menu" />
            <button className="btn_map" onClick={this.showMap}/>
            <button className="btn_msg" />
            <button className="btn_edit" />
            <button className="btn_group" />
            <button className="btn_volume" />

            {this.state.showMap &&

            <div className="bar-map">
                {sitPositions}
            </div>
            }
        </div>

    }
    showMap = () => {
        this.setState({showMap: true});
    };

    onClick = (index) => {
        this.setState(
            //вызывается инициирование аватара. Передается индекс (индекс в нашем случаем - место в баре)
            {showMap: false},
            () => this.props.onLocationChange(index),
            //console.log(index)
        );
    }


}