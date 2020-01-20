import React from 'react';

import './styles.scss';

var link_list = ["/home", "/profile", "/schedule", "/monthlyPlan", "/inventory",
                 "/activityPlanning", "/fileSharing", "/teamManagement", "/usersAccessRequest"];

function disable(n, en) {
    window.onload = function(){
        var el = document.getElementById("menu" + n);
        if(el === undefined || el === null) return
        el.style.textDecoration = "underline";
        if(!en){
            el.style.cursor = "default";
            el.classList.remove('hover');
        }
        if(n > 4) {
            var other = document.getElementById("other");
            other.style.textDecoration = "underline";

            if(n > 7) {
                var admin = document.getElementById("admin");
                admin.childNodes[0].style.textDecoration = "underline";
            }
        }

        var stickyEl = document.querySelector('.me_sticky');
        if(stickyEl != undefined){
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
            myDiv.onmouseover = function() {myEl.style.backgroundColor = '#f1f1f1'};
            myDiv.onmouseleave = function() {myEl.style.backgroundColor = 'transparent'};
        }
    }; 
}

function redir(underline, n, en) {
    if(underline != n+1 || en){window.location.href = link_list[n];}    
}


const NavBar = ({underline, enable = 0}) =>
    <nav className="main_nav" id="nav">
        {disable(underline, enable)}
        <div className="main_nav_wrap me_sticky">
            <ul className="menu left">
                <li><a className="hover" id="menu1" onClick={() => redir(underline, 0, enable)}>Home</a></li>
            </ul>
            <ul className="menu center">
                <li><a className="hover" id="menu2" onClick={() => redir(underline, 1, enable)}>Profile</a></li>
                <li><a className="hover" id="menu3" onClick={() => redir(underline, 2, enable)}>Schedule</a></li>
                <li><a className="hover" id="menu4" onClick={() => redir(underline, 3, enable)}>Monthly plan</a></li>
                <div className="dropdown">
                    <li className="dropbtn"><a className="hover" id="other">Other</a></li>
                    <div className="dropdown-content main">
                        <a className="hover" id="menu5" onClick={() => redir(underline, 4, enable)}>Inventory</a>
                        <a className="hover" id="menu6" onClick={() => redir(underline, 5, enable)}>Activity planning</a>
                        <a className="hover" id="menu7" onClick={() => redir(underline, 6, enable)}>File sharing</a>
                        <a className="hover" id="admin"><span>Administration </span><i className ="fa fa-angle-right"></i></a>
                        <div className="dropdown-content admin">
                            <a className="hover" id="menu8" onClick={() => redir(underline, 7, enable)}>Team management</a>
                            <a className="hover" id="menu9" onClick={() => redir(underline, 8, enable)}>Users access request</a>
                        </div>
                    </div>
                </div>
            </ul>
            <ul className="menu right">
                <li><a className="hover">Sign out <i className="fa fa-sign-out"></i></a></li>
            </ul>
        </div>
    </nav>

export default NavBar;