import React, { Component } from 'react';

import './styles.scss';

import api from '../../services/api'

import avatar from '../../images/other.png'

import NavBar from '../../components/navBar';
import Footer from '../../components/footer';
import FindUserEl from '../../components/findUserEl';

export default class FindUserPage extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            elements: [],
            id: null,
            el_num: 0,
            page: 0,
            per_page: 5,
        }
    }

    arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    handleKeyPress = async (e, btn = 0) => {
        let search = document.querySelector('#search').value;

        if(e.keyCode === 13 && search || btn && search) {
            this.state.elements = []
            let res = await api.get(`/users/paginate?search=${search}&id=${localStorage.getItem('id')}`)
            let pics = await api.get(`/users/retrieveProfilePics?userId=${localStorage.getItem('id')}`)

            let aux = []

            pics.data.map(pic => {
                var base64Flag = 'data:image/jpeg;base64,';
                var imageStr = this.arrayBufferToBase64(pic.img.data.data);
                aux.push({picture: base64Flag + imageStr, userId: pic.userId})
            })

            res.data.docs.map(usr => {
                let pic = avatar;
                for(let i = 0; i< aux.length; i++) {
                    if(aux[i].userId === usr._id) {pic = aux[i].picture; break}
                }

                this.state.elements.push(<FindUserEl img = {pic} name = {usr.name+' '+usr.surname} email = {usr.email} id = {usr._id}/>)
            })
            this.state.el_num = res.data.total
            this.forceUpdate()
        }
        else if(e.keyCode === 13 && !search || btn) {
            this.state.elements = []
            this.state.el_num = 0
            this.forceUpdate()
        }
    }

    search = async () => {

    }

    render() {
        return(
            <div className = "findUserPage">
                <NavBar underline = '7'/>
                <div className = 'displayArea'>
                    <div class="searchbox">
                        <button class="btn-menu">
                        </button>
                        <input id="search" type="text" placeholder="Find User" name="search" class="search" onKeyDown = {e => this.handleKeyPress(e)} autocomplete="off"/>
                        <button  class="btn-search" onClick = {(e) => this.handleKeyPress(e, 1)}>
                            <img src = "https://img.icons8.com/cotton/24/000000/search--v2.png" />
                        </button>
                    </div>
                    {this.state.el_num ? this.state.elements.map(element => element) : <p id = 'placeHolder'>Try searching for a user's name...</p>}
                </div>
                
                <Footer />
            </div>
        )
    }
}