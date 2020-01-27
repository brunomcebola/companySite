import React, { Component } from 'react';

import './styles.scss';

import NavBar from '../../components/navBar';
import List from '../../components/list';
import Footer from '../../components/footer';

export default class InventoryListPage extends Component {
    render() {
        return(
            <div id="planListPage">
                <NavBar underline = "4" />
                <List type = "invent"/>
                <Footer />
            </div>
        );
    }
}