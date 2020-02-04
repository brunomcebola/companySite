/******************************************************************************
* 
* Profile page created by Bruno Cebola  
*
******************************************************************************/

import React, { Component } from 'react';
//import ImageUploader from 'react-images-upload';

import api from '../../services/api'
import settings from '../../config'

import './styles.scss';

import Footer from '../../components/footer';
import NavBar from '../../components/navBar';

export default class ProfilePage extends Component {
    constructor(props) {
        super(props);
          this.state = {
            selectedFile: null,
            img: '',
            usr: decodeURIComponent(window.location.href.substring(window.location.href.lastIndexOf('/') + 1)),
            name: ''
          }
    }

    onClickHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        api.put(`users/uploadImage?id=${localStorage.getItem('id')}`, data, {})
            .then(res => {})

        this.forceUpdate()
    }

    arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    preview = (event) => {
        var reader = new FileReader();
        reader.onload = function() {
            var output = document.getElementById('pic');
            var placeholder = document.getElementById('cam');
            var container = document.querySelector(".profile-pic");
            placeholder.style.display = "none";
            output.style.display = "block";
            container.style.paddingTop = "6%";
            container.style.paddingBottom = "6%";
            output.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })  
    }

    name = async () => {
        let res = await api.get(`/users/name?id=${this.state.usr === 'profile' ? localStorage.getItem('id'): this.state.usr}`);
        this.setState({name: res.data})
    }
    
    componentDidMount() {
        var follow = document.querySelector("#follow");
        if(follow) {
            follow.addEventListener("click", function() {
                if(follow.classList.contains("level1")) {
                    follow.classList.remove("level1");
                    follow.classList.add("level2");
                    follow.innerHTML = "Unfollow";
                }
                else {
                    follow.classList.remove("level2");
                    follow.classList.add("level1");
                    follow.innerHTML = "Follow";
                }
            });
        }
        
        fetch(`${settings.api_link}users/retrieveProfilePic?userId=${this.state.usr === 'profile' ? localStorage.getItem('id'): this.state.usr}`)
            .then((response) => response.json())
            .catch(() => {})
            .then((data) => {
                if(data) {
                    var base64Flag = 'data:image/jpeg;base64,';
                    var imageStr = this.arrayBufferToBase64(data.img.data.data);
                    this.setState({
                        img: base64Flag + imageStr
                    })
                }
            })
        
        this.name()
    }

    render() {
        return(
            <div id="profilePage">
                <NavBar underline="11" enable = {this.state.usr === 'profile' ? null : '1'}/>

                {this.state.usr === 'profile' ? <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload profile photo</button> : null }

                <div className = "profile-container">
                    <div className = "profile">
                        <div className = "profile-pic">
                            <label for="file-input">
                                <i id = "cam" class="fa fa-camera" aria-hidden="true"></i>
                                <img id = "pic" alt = "profile-pic" src={this.state.img}></img>
                            </label>
                            <input id="file-input" type="file" onChange = {event => this.preview(event)} disabled = {this.state.usr !== 'profile'}/>
                        </div>
                        <div className = "profile-contact">
                            {this.state.usr !== 'profile' ?
                                <div className = "left">
                                    <button id = "follow" className = "level1">Follow</button>
                                </div>
                            : null }
                            {this.state.usr !== 'profile' ?
                                <div className = "right">
                                    <button id = "contact" className = "level1">Contact</button>
                                </div>
                            : null }
                        </div>
                        <div className = "profile-info">
                            <div>
                                <h3>Recent activity</h3>
                            </div>
                            <div>
                                <h3>About me</h3>
                                <p><strong>Name: </strong>{this.state.name}</p>
                            </div>
                            <div>
                                <h3>...</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}