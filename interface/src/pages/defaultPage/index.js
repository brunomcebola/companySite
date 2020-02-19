/******************************************************************************
* 
* Default page created by Bruno Cebola  
*
******************************************************************************/

//REACT.JS COMPONENTS
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


//PÁGINA MOSTRADA QUANDO O LINK INTRODUZIDO É INCORRETO
export default class DefaultPage extends Component {
    render() {
        return(
            <Redirect to='/' />
        )
    }
}