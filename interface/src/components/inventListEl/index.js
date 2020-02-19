import React, { Component } from 'react';
import { progressBarFetch, setOriginalFetch, ProgressBar } from 'react-fetch-progressbar';

import axios from 'axios';
import api from '../../services/api'

import _variables from '../../utilities/_variables.scss';

import './styles.scss';

setOriginalFetch(window.fetch);
window.fetch = progressBarFetch;

var lastClick = null;
var newClick = null;

export default class InventListEl extends Component {
    ordinal_suffix_of = (i) => {
        var j = i % 10,
            k = i % 100;
        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    }

    name = (name) => {
        if(!name){
            name = this.ordinal_suffix_of(this.props.num) + " Inventory" 
        }
        return name
    }

    setEditable = (e) => {
        let el = document.querySelector("#"+e)
        el.setAttribute("contenteditable", "true");
        el.style.borderBottomColor = _variables.accent;
        el.style.transform = "translateY(-5px)";
        el.focus();
        newClick = el.parentElement.getAttribute("id");
    }

    redirect = async (num, id) => {
        let div = document.querySelector("#div"+num);
        await api.post(`/inventory/updateTableName?tableId=${id}`, {name: div.innerHTML})
        window.location.href = window.location.href + '/' + id;
    }

    componentDidMount() {
        window.addEventListener("click", function(el){
            if(el.target.parentElement !== null && el.target.parentElement.getAttribute("id") !== lastClick){
                var element = document.querySelector(`#${lastClick}`)
                if(element !== null){
                    element.firstChild.setAttribute("contenteditable", "false");
                    element.firstChild.style.borderBottomColor = "transparent";
                    element.firstChild.style.transform = "translateY(0)";
                }
                lastClick = newClick;               
            }
        });

        let divs = document.querySelectorAll("div");        

        divs.forEach(function(elem) {
            let id = elem.id

            let typingTimer;                //timer identifier
            let doneTypingInterval = 1000;  //time in ms: 2 seconds

            if(id.match('div')){ 
                elem.addEventListener('keyup', async function() {
                    let id = elem.parentElement.parentElement.parentElement.id
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(async () => await api.post(`/inventory/updateTableName?tableId=${id}`, {name: elem.innerHTML}), doneTypingInterval);
                });

                elem.addEventListener('keydown', function () {
                    clearTimeout(typingTimer);
                });
            }
        });
    }

    download = async (id) => {
        let cover = document.querySelector(`#ilc${this.props.id}`)
        cover.style.display = 'block'

        fetch(`http://localhost:3001/inventory/pdf?tableId=${id}`, {
            method: "GET",
            responseType: "blob"
            //Force to receive data in a Blob Format
        })
            .then(response => response.blob())
            .then(response => {
                //Create a Blob from the PDF Stream
                const file = new Blob([response], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                //window.open(fileURL);
            })
            .catch(error => {
                console.log(error);
        });
    }

    render() {
        return(
            <div className = "inventListElAux">
                <div className = "inventListEl" id = {this.props.id}>
                    <div>
                        <h3 id = {"h3"+this.props.num}>
                            <div id = {"div"+this.props.num}>{this.name(this.props.name)}</div>
                            <i className = {`fa fa-trash-o ${this.props.creator_id !== localStorage.getItem('id') ? 'disabled' : ''}`} onClick = {this.props.creator_id === localStorage.getItem('id') ? (() => this.props.modal(this.props.id)) : null}></i>
                            <i className = {`fa fa-pencil ${this.props.creator_id !== localStorage.getItem('id') ? 'disabled' : ''}`} onClick = {this.props.creator_id === localStorage.getItem('id') ? () => this.setEditable("div"+this.props.num) : null}></i>
                            <i className = "fa fa-download" onClick = {() => this.download(this.props.id)}></i>
                        </h3>
                        <p><strong>Created by: </strong>{this.props.info}</p>
                        <p><strong>At: </strong>{this.props.date}</p>
                    </div>
                    <button className = "level1" onClick = {() => this.redirect(this.props.num, this.props.id)}>View</button>
                </div>
                <div className = "inventListElCover" id = {"ilc"+this.props.id}>
                    <ProgressBar style={{
                        backgroundColor: 'green', 
                        height: '20px',
                        left: '0',
                        top: '50px'
                    }}/>
                </div>
            </div>
        )
    }
}