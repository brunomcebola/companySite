/******************************************************************************
* 
* Monthly Plan page created by Bruno Cebola  
*
******************************************************************************/

import React, { Component } from 'react';

import './styles.scss';

import NavBar from '../../components/navBar';
import PlanList from '../../components/planList';
import Footer from '../../components/footer';

export default class PlanListPage extends Component {
    render() {
        return(
            <div id="planListPage">
                <NavBar underline = "3" />
                <PlanList />
                <Footer />
            </div>
        );
    }
}