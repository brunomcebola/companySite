/******************************************************************************
* 
* Monthly Plan page created by Bruno Cebola  
*
******************************************************************************/

import React, { Component } from 'react';

import './styles.scss';

import NavBar from '../../components/navBar';
import List from '../../components/list';
import Footer from '../../components/footer';

export default class MonthlyPlanListPage extends Component {
    render() {
        return(
            <div id="monthlyPlanListPage">
                <NavBar underline = "3" />
                <List type = "month"/>
                <Footer />
            </div>
        );
    }
}