/******************************************************************************
* 
* Profile page created by Bruno Cebola  
*
******************************************************************************/

import React, { Component } from 'react';

import './styles.scss';

import Footer from '../../components/footer';
import NavBar from '../../components/navBar';

export default class ProfilePage extends Component {
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
    }
    
    componentDidMount() {
        var follow = document.querySelector("#follow");
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

    render() {
        return(
            <div id="profile-general">
                <NavBar underline = "2" />
                <div className = "profile-container">
                    <div className = "profile">
                        <div className = "profile-pic">
                            <label for="file-input">
                                <i id = "cam" class="fa fa-camera" aria-hidden="true"></i>
                                <img id = "pic" alt = "profile-pic"></img>
                            </label>
                            <input id="file-input" type="file" onChange = {event => this.preview(event)}/>
                        </div>
                        <div className = "profile-contact">
                            <div className = "left">
                                <button id = "follow" className = "level1">Follow</button>
                            </div>
                            <div className = "right">
                                <button id = "contact" className = "level1">Contact</button>
                            </div>
                        </div>
                        <div className = "profile-info">
                            <div>
                                <h3>Recent activity</h3>
                            </div>
                            <div>
                                <h3>About me</h3>
                                <p>Age: 18 years old</p>
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