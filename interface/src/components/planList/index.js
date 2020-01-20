import React, { Component } from 'react';

import CheckModal from '../checkModal'
import _variables from '../../utilities/_variables.scss';

import './styles.scss';

var lastClick = null;
var newClick = null;

class PlanListEl extends Component {
    date = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

    ordinal_suffix_of = (i) => {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
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

    render() {
        return(
            <div className = "planListEl" id = {"aaaa"}>
                <div>
                    <h3 id = {"h3"+this.props.num}>
                        <div id = {"div"+this.props.num}>{this.name(this.props.name)}</div>
                        <i className = "fa fa-trash-o" onClick = {() => this.props.modal("aaaa")}></i>
                        <i className = "fa fa-pencil" onClick = {() => this.setEditable("div"+this.props.num)}></i>
                    </h3>
                    <p>Created by: John Doe (Admin)</p>
                    <p>At: {this.date()}</p>
                </div>
                <button className = "level1" onClick = {() => this.redirect(this.name(this.props.name))}>View</button>
            </div>
        )
    }
}

export default class PlanList extends Component {
    state = {
        elements: [],
        id: null,
        el_num: 1
    }

    new = () => {    
        this.state.elements.unshift(<PlanListEl num = {this.state.el_num} modal = {this.showModal}/>)
        this.state.el_num++;
        this.forceUpdate();
    }

    add = () => {
        this.state.elements.push(<PlanListEl name = "November 2019 Monthly plan" modal = {this.showModal}/>)
        this.state.el_num++;
        this.forceUpdate();
    }

    showModal = (id) => {
        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "flex";

        this.setState({id});
    }

    del = (el_key) => {
        var el = document.getElementById(this.state.id)
        el.parentElement.removeChild(el);

        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";
    }

    cancel = () => {
        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";
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

    render(){
        return(
            <div id = "planList">
                <button className = "level1" id = "new" onClick = {() => this.new()}>Create new plan</button>
                {this.state.elements.map(element => element)}
                <button className = "level2" id = "load" onClick = {() => this.add()} >Load more plans</button>
                <CheckModal phrase = "Delete plan?" check = {this.del} cancel = {this.cancel}/>
            </div>
        )
    }
}
