import React, { Component } from 'react';

import './styles.scss';
import api from '../../services/api'
import settings from '../../config'

import avatar from '.././../images/other.png';
import logo from '../../images/logo.png'

var link_list = ["/home", "/schedule", "/monthlyPlans", "/inventory",
                 "/activityPlanning", "/fileSharing", "/findUser", "/usersManagement", "/usersAccessRequest",
                 "/analytics", "/profile"];

export default class NavBar extends Component {
    constructor(props) {
        super(props);
          this.state = {
            selectedFile: null,
            img: '',
            img_empty: true,
            permissions: 0,
            name: ''
          }
    }

    arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    disable = (n, en = 0) => {
        var el = document.getElementById("menu" + n);
        if(el === undefined || el === null) return
        if(!en){
            el.style.cursor = "default";
            el.classList.remove('hover');
        }
        if(n >= 11) {
            el.style.textDecoration = 'underline'
        }
        else if(n > 3) {
            el.style.textDecoration = 'underline'
            
            var other = document.getElementById("other");
            other.style.borderBottomColor = "#fff";

            if(n > 7) {
                var admin = document.getElementById("admin");
                admin.childNodes[0].style.textDecoration = "underline";
            }
        }
        else {
            el.style.borderBottomColor = "#fff";
        }

        var stickyEl = document.querySelector('.me_sticky');
        if(stickyEl !== undefined){
            var myEl = document.getElementById('admin');
            var myDiv = document.querySelector('.dropdown-content.admin');
            var stickyPosition = stickyEl.getBoundingClientRect().top;
            var offset = -100;
            window.addEventListener('scroll', function() {
                if (window.pageYOffset >= stickyPosition + offset) {
                    stickyEl.style.position = 'fixed';
                    stickyEl.style.top = '0px';
                    stickyEl.style.zIndex = '20';
                } else {
                    stickyEl.style.position = 'static';
                    stickyEl.style.top = '';
                    stickyEl.style.zIndex = '';
                }
            });
            if(myEl){
                myDiv.onmouseover = function() {myEl.style.backgroundColor = '#f1f1f1'};
                myDiv.onmouseleave = function() {myEl.style.backgroundColor = 'transparent'};
            }
        }
    }

    redir = (underline, n, en = 0) => {
        if(underline != n+1 || en){window.location.href = link_list[n];}    
    }

    signout = () => {
        localStorage.removeItem('id');
        window.location.href = '/';
    }

    drop = () => {
        let el = document.querySelector('.menu.right .dropdown')
        el.childNodes[0].childNodes[0].style.backgroundColor = "#fff";
        el.childNodes[0].childNodes[0].style.color = "#000";
        el.childNodes[0].childNodes[0].childNodes[0].style.filter = "invert(0%)";
        el.childNodes[1].style.display = 'block'
        el.childNodes[0].childNodes[0].querySelector('i').classList.remove('rotate_down')
        el.childNodes[0].childNodes[0].querySelector('i').classList.add('rotate_up')
    }
    
    getName = async () => {
        let id = localStorage.getItem('id');
        let name = await api.get(`/users/name?id=${id}`);
        this.setState({name: name.data})
    }

    getPermissions = async () => {
        let id = localStorage.getItem('id');
        let permissions = await api.get(`/users/permissions?id=${id}`);
        this.setState({permissions: permissions.data})
        this.forceUpdate()
    }

    componentDidMount() {
        this.getName();
        this.getPermissions();
        this.disable(this.props.underline, this.props.enable);

        window.addEventListener("click", function(l){
            let el = document.querySelector('.menu.right .dropdown')
        
            if(el && l.target && l.target.id !== 'a-av' && l.target.id !== 'img-av' && l.target.id !== 'img-av empty' &&
               l.target.id !== 'i-av' && l.target.parentElement && l.target.parentElement.id !== 'dc-av'){
                el.childNodes[0].childNodes[0].style.backgroundColor = "transparent";
                el.childNodes[0].childNodes[0].style.color = "#fff";
                el.childNodes[0].childNodes[0].childNodes[0].style.filter = this.state.img_empty ? "invert(100%)" : null;
                el.childNodes[1].style.display = 'none';
                if(el.childNodes[0].childNodes[0].querySelector('i').classList.contains('rotate_up')){
                    el.childNodes[0].childNodes[0].querySelector('i').classList.remove('rotate_up')
                    el.childNodes[0].childNodes[0].querySelector('i').classList.add('rotate_down')
                }
            }
        }.bind(this));

        fetch(`${settings.api_link}users/retrieveProfilePic?userId=${localStorage.getItem('id')}`)
            .then((response) => response.json())
            .catch(() => {})
            .then((data) => {
                if(data) {
                    var base64Flag = 'data:image/jpeg;base64,';
                    var imageStr = this.arrayBufferToBase64(data.img.data.data);
                    this.setState({
                        img: base64Flag + imageStr,
                        img_empty: false
                    })
                }
            })
    }

    componentDidUpdate(){
        this.disable(this.props.underline, this.props.enable);
    }

    render() {
        return(
            <nav className="main_nav" id="navBar">
                <div className="main_nav_wrap me_sticky">
                    <ul className="menu left">
                        <li><a><img src = {logo}/></a></li>
                    </ul>
                    <ul className="menu center">
                        <li><a className="hover" id="menu1" onClick={() => this.redir(this.props.underline, 0, this.props.enable)}>Home</a></li>
                        <li><a className="hover" id="menu2" onClick={() => this.redir(this.props.underline, 1, this.props.enable)}>Schedule</a></li>
                        <li><a className="hover" id="menu3" onClick={() => this.redir(this.props.underline, 2, this.props.enable)}>Monthly plans</a></li>
                        <div className="dropdown">
                            <li className="dropbtn"><a className="hover" id="other">Other <i className="fa fa-angle-down" id = 'i-av'></i></a></li>
                            <div className="dropdown-content main">
                                <a className="hover" id="menu4" onClick={() => this.redir(this.props.underline, 3, this.props.enable)}>Inventory</a>
                                <a className="hover" id="menu5" onClick={() => this.redir(this.props.underline, 4, this.props.enable)}>Activity planning</a>
                                <a className="hover" id="menu6" onClick={() => this.redir(this.props.underline, 5, this.props.enable)}>File sharing</a>
                                <a className="hover" id="menu7" onClick={() => this.redir(this.props.underline, 6, this.props.enable)}>Find user</a>
                                {this.state.permissions === 2 ?
                                    <span>
                                        <a className="hover" id="admin"><span>Administration </span><i className ="fa fa-angle-right"></i></a>
                                        <div className="dropdown-content admin">
                                            <a className="hover" id="menu8" onClick={() => this.redir(this.props.underline, 7, this.props.enable)}>Users management</a>
                                            <a className="hover" id="menu9" onClick={() => this.redir(this.props.underline, 8, this.props.enable)}>Users access request</a>
                                            <a className="hover" id="menu10" onClick={() => this.redir(this.props.underline, 9, this.props.enable)}>Analytics</a>
                                        </div>
                                    </span>
                                : null}
                            </div>
                        </div>
                    </ul>
                    <ul className="menu right">
                        <div className="dropdown">
                            <li className="dropbtn">
                                <a className="hover" onClick = {() => this.drop()} id = 'a-av'>
                                    <img className = {this.state.img_empty ? 'empty': ''} src={this.state.img ? this.state.img : avatar} id = {`img-av${this.state.img_empty ? ' empty': ''}`}/> <i className="fa fa-angle-down" id = 'i-av'></i>
                                </a>
                            </li>
                            <div className="dropdown-content" id = 'dc-av'>
                                <p>Signed in as</p>
                                <p><strong>{this.state.name}</strong></p>
                                <a className="hover" id="menu11" onClick={() => this.redir(this.props.underline, 10, this.props.enable)}>Profile</a>
                                <a className="hover" id="menu12">Help</a>
                                <a className="hover" id="menu13">Settings</a>
                                <a className="hover" id="menu" onClick = {() => this.signout()}><span>Sign out</span><i className="fa fa-sign-out"></i></a>
                            </div>
                        </div>
                    </ul>
                </div>
            </nav>
        )
    }
}