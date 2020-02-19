import React, { Component } from 'react';
import randomstring  from "randomstring";

import CheckModal from '../checkModal'
import PlanListEl from '../planListEl'
import InventListEl from '../inventListEl'

import api from '../../services/api'

import _variables from '../../utilities/_variables.scss';

import './styles.scss';

function type(t) {
    switch(t) {
        case 'month':
            return {button: 'monthly plan', placeHolder: 'plans'}
        case 'invent':
            return {button: 'inventory', placeHolder: 'inventories'}
    }
}

function getDate() {
    
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

async function getUserInfo() {
    let id = localStorage.getItem('id');
    let name = await api.get(`/users/name?id=${id}`);
    return name.data
}

export default class List extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            elements: [],
            id: null,
            el_num: 0,
            page: 0,
            per_page: 5,
            text: type(this.props.type).button,
        }
    }
    
    new = async () => {  
        let el
        let id = randomstring.generate({length: 32});
        let date = getDate()
        let info = await getUserInfo()

        if(this.props.type === "month") {
            el = <PlanListEl num = {this.state.el_num + 1} modal = {this.showModal} id = {id}/>
            this.state.elements.unshift({el, id})
            this.setState({ el_num: this.state.el_num + 1 })
        }
        else if(this.props.type === "invent") {
            el = <InventListEl num = {this.state.el_num + 1} modal = {this.showModal} id = {id} date = {date} info = {info} creator_id = {localStorage.getItem('id')}/>
            this.state.elements.unshift({el, id})
            this.setState({ el_num: this.state.el_num + 1 })

            let ele = document.querySelector('#div'+ this.state.el_num)
            let data = {id, name: ele.innerHTML, creator: info, creator_id: localStorage.getItem('id'), created_at: date}

            await api.post('/inventory/create', data)
        }
    }

    add = async () => {
        //not working. nets to connect to database

        if(this.props.type === "month") {
            //this.state.elements.push(<PlanListEl name = "November 2019 Monthly plan" modal = {this.showModal}/>)
        }
        else if(this.props.type === "invent") {
            let ans = await api.get('/inventory/paginate')

            for(let i = (ans.data.length - 1); i >= 0 ; i--) {
                this.state.elements.unshift({el: 
                    <InventListEl 
                        name = {ans.data[i].name} 
                        num = {this.state.el_num + 1} 
                        modal = {this.showModal} 
                        id = {ans.data[i].id} 
                        date = {ans.data[i].created_at} 
                        info = {ans.data[i].creator}
                        creator_id = {ans.data[i].creator_id}
                    />, 
                    id: ans.data[i].id
                })
                this.setState({ el_num: this.state.el_num + 1 })
            }
        }

        this.forceUpdate()
    }

    showModal = (id) => {
        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "flex";

        this.setState({id});
    }

    del = async () => {
        var el = document.getElementById(this.state.id)

        if(!el) return

        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";

        this.state.elements.splice(this.state.elements.findIndex((data) => {return data.id == el.id}),1)
        this.setState({ el_num: this.state.el_num - 1 })
        this.forceUpdate()

        if(this.props.type === "month") {
            //TODO
        }
        else if(this.props.type === "invent") {
            await api.delete('/inventory/delete?tableId=' + el.id)
        }

    }

    cancel = () => {
        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";
    }

    permissions = async () => {
        let id = localStorage.getItem('id');
        let permissions = await api.get(`/users/permissions?id=${id}`);
        if(!permissions.data) {
            document.querySelector('#new').disabled = true
        }
    }

    componentDidMount() {
        this.add()
        this.permissions()
    }

    render(){
        return(
            <div id = "list">
                <button className = "level1" id = "new" onClick = {() => this.new()}>Create new {this.state.text}</button>
                {this.state.elements.length ? this.state.elements.map(element => {
                    if(this.state.elements.findIndex((data) => {return data.el == element.el}) >= this.state.page * this.state.per_page && this.state.elements.findIndex((data) => {return data.el == element.el}) < (this.state.page + 1) * this.state.per_page) return element.el
                }) : <h3 style = {{color: 'grey'}}>No {type(this.props.type).placeHolder} to display</h3>}
                <div id = "baseButtons">
                    <button disabled = {this.state.page === 0} className = 'level3' onClick = {() => this.setState({ page: this.state.page - 1 })}><i className = 'fa fa-arrow-left'></i> Previous page</button>
                    <button disabled = {this.state.el_num - 1 < this.state.per_page * (this.state.page + 1)} className = 'level3' onClick = {() => this.setState({ page: this.state.page + 1 })}>Next page <i className = 'fa fa-arrow-right'></i></button>
                </div>
                <CheckModal phrase = "Delete plan?" button1 = "Delete" check = {this.del} button2 = "Cancel" cancel = {this.cancel} topDist = {window.scrollY}/>
            </div>
        )
    }
}
