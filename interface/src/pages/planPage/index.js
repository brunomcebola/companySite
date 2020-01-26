import React, { Component } from 'react';

import './styles.scss';

import NavBar from '../../components/navBar';
import Footer from '../../components/footer';
import Plan from "../../components/plan"

export default class PlanPage extends Component {
    render() {
        return (
            <div id = "planPage">
                <NavBar underline = "3" enable = "1"/>
                <Plan />            
                <Footer />
            </div>
        );
    }
}