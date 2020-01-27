import React, { Component } from 'react';
import randomstring  from "randomstring";

import CheckModal from '../checkModal'
import PlanListEl from '../planListEl'
import InventListEl from '../inventListEl'

import _variables from '../../utilities/_variables.scss';

import './styles.scss';

function type(t) {
    switch(t) {
        case 'month':
            return 'plan'
        case 'invent':
            return 'inventory'
    }
}

export default class List extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            elements: [],
            id: null,
            el_num: 0,
            page: 0,
            per_page: 2,
            text: type(this.props.type)
        }
    }
    

    new = () => {  
        let el
        let id = randomstring.generate({length: 32});

        if(this.props.type === "month") {
            el = <PlanListEl num = {this.state.el_num + 1} modal = {this.showModal}/>
            this.state.elements.unshift(el)
        }
        else if(this.props.type === "invent") {
            el = <InventListEl num = {this.state.el_num + 1} modal = {this.showModal} id = {id}/>
        }

        this.state.elements.unshift({el, id})
        this.setState({ el_num: this.state.el_num + 1 })
        this.forceUpdate();
    }

    add = () => {
        if(this.props.type === "month") {
            this.state.elements.push(<PlanListEl name = "November 2019 Monthly plan" modal = {this.showModal}/>)
        }
        else if(this.props.type === "invent") {
            this.state.elements.push(<InventListEl num = {this.state.el_num + 1} modal = {this.showModal}/>)
        }

        this.setState({ el_num: this.state.el_num + 1 })
        this.forceUpdate();
    }

    showModal = (id) => {
        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "flex";

        this.setState({id});
    }

    del = () => {
        var el = document.getElementById(this.state.id)

        if(!el) return

        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";

        this.state.elements.splice(this.state.elements.findIndex((data) => {return data.id == el.id}),1)
        this.state.el_num = this.state.el_num - 1

        this.forceUpdate()

    }

    cancel = () => {
        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";
    }

    render(){
        return(
            <div id = "list">
                <button className = "level1" id = "new" onClick = {() => this.new()}>Create new {this.state.text}</button>
                {this.state.elements.map(element => {
                    if(this.state.elements.findIndex((data) => {return data.el == element.el}) >= this.state.page * this.state.per_page && this.state.elements.findIndex((data) => {return data.el == element.el}) < (this.state.page + 1) * this.state.per_page) return element.el
                })}
                <div id = "baseButtons">
                    <button disabled = {this.state.page === 0} className = 'level3' onClick = {() => this.setState({ page: this.state.page - 1 })}><i className = 'fa fa-arrow-left'></i> Previous page</button>
                    <button disabled = {this.state.el_num - 1 < this.state.per_page * (this.state.page + 1)} className = 'level3' onClick = {() => this.setState({ page: this.state.page + 1 })}>Next page <i className = 'fa fa-arrow-right'></i></button>
                </div>
                <CheckModal phrase = "Delete plan?" button1 = "Delete" check = {this.del} button2 = "Cancel" cancel = {this.cancel}/>
            </div>
        )
    }
}
