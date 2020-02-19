import React, { Component } from 'react';

import _variables from '../../utilities/_variables.scss';

import './styles.scss';
import api from '../../services/api'

import avatar from '../../images/other.png'

export default class FindUserEl extends Component {
    redirect = (id) => {
        window.location = '/profile/' + id;
    }

    render() {
        return(
            <div className = "findUserEl" id = {this.props.id}>
                <img src = {this.props.img}/>
                <div>
                    <p><strong>Name: </strong>{this.props.name}</p>
                    <p><strong>Email: </strong>{this.props.email}</p>
                </div>
                <button className = "level1" onClick = {() => this.redirect(this.props.id)}>View profile</button>
            </div>
        )
    }
}