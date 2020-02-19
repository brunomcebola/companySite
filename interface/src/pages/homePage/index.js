import React, { Component } from 'react';

import './styles.scss';

import api from '../../services/api'
import axios from 'axios';

import avatar from '../../images/other.png'

import NavBar from '../../components/navBar';
import Footer from '../../components/footer';
import FindUserEl from '../../components/findUserEl';

export default class HomePage extends Component {
    down = async () => {
        axios(`http://localhost:3001/inventory/pdf`, {
            method: "GET",
            responseType: "blob"
            //Force to receive data in a Blob Format
        })
            .then(response => {
                console.log(response)
              //Create a Blob from the PDF Stream
              const file = new Blob([response.data], {
                type: "application/pdf"
              });
              //Build a URL from the file
              const fileURL = URL.createObjectURL(file);
              //Open the URL on new Window
              window.open(fileURL);
            })
            .catch(error => {
              console.log(error);
        });
    }

    render() {
        return(
            <div className = "homePage">
                <NavBar underline = '1'/>
                <button onClick = {this.down}>try</button>
                <Footer />
            </div>
        )
    }
}