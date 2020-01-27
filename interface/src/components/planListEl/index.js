import React, { Component } from 'react';

import _variables from '../../utilities/_variables.scss';

import './styles.scss';

var lastClick = null;
var newClick = null;

export default class PlanListEl extends Component {
    date = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var sec = String(today.getSeconds()).padStart(2, '0');
        var min = String(today.getMinutes()).padStart(2, '0');
        var hr = String(today.getHours()).padStart(2, '0');

        today = dd + '/' + mm + '/' + yyyy + ' - ' + hr + ':' + min + ':' + sec;
        return today;
    }

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
            name = "My " + this.ordinal_suffix_of(this.props.num) + " Monthly Plan" 
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

    redirect = (id) => {
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
    }

    render() {
        return(
            <div className = "planListEl" id = {this.props.id}>
                <div>
                    <h3 id = {"h3"+this.props.num}>
                        <div id = {"div"+this.props.num}>{this.name(this.props.name)}</div>
                        <i className = "fa fa-trash-o" onClick = {() => this.props.modal(this.props.id)}></i>
                        <i className = "fa fa-pencil" onClick = {() => this.setEditable("div"+this.props.num)}></i>
                    </h3>
                    <p>Created by: John Doe (Admin)</p>
                    <p>At: {this.date()}</p>
                </div>
                <button className = "level1" onClick = {() => this.redirect(this.props.id)}>View</button>
            </div>
        )
    }
}