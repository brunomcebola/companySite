/******************************************************************************
* 
* Login page created by Bruno Cebola  
*
******************************************************************************/

import React, { Component } from 'react';

import api from '../../services/api';
import settings from '../../config'

import './styles.scss';

import Footer from '../../components/footer';

export default class LoginPage extends Component {
    /******************************************************************************
    * Name: signin()
    *
    * Arguments: e - element calling the function
    *
    * Return: none
    *
    * Side-effects: if the submited data is accepted then the user is redirected
    *
    * Description: combines the info in the database to signin 
    *
    ******************************************************************************/
    login = async (e) => {
        e.preventDefault();

        var username = document.getElementById("username-in").value;
        var password = document.getElementById("pass-in").value;

        let resp = await api.post('/users/login', {username, password});

        if(resp.status === 200) {
            window.location.href = '/home'
        }
    }

    /******************************************************************************
    * Name: signup()
    *
    * Arguments: e - element calling the function
    *
    * Return: none
    *
    * Side-effects: if the submited data is correct then a green checkmark appears
    *
    * Description: submits the information to the database 
    *
    ******************************************************************************/
    signup = async (e) => {
        e.preventDefault();

        //get elements that are going to be affected
        var form = document.getElementById("signup-form");
        var container = document.getElementById("succ-signup");
        var circle = document.getElementById("circle");
        var mark = document.getElementById("mark");

        var name = document.getElementById("name-up").value;
        var surname = document.getElementById("surname-up").value;
        var email = document.getElementById("email-up").value;

        var data = {name, surname, email}
  
        let response = await api.post('/accessRequest/new', data);

        console.log(response.status)

        //changes the display of the sign-up panel from form to checkmark
        form.style.display = "none";
        container.style.display = "block";
        if (circle.style.display === "inline-block") {
            circle.style.display = "none";
        } else {
            circle.style.display = "inline-block";
        }
        if (mark.style.display === "block") {
            mark.style.display = "none";
        } else {
            mark.style.display = "block";
        }
    }

    /******************************************************************************
    * Name: togglePassword()
    *
    * Arguments: n - selects the password input field
    *                0 - sign-in 
    *                1 - sign-up
    *
    * Return: none
    *
    * Side-effects: none
    *
    * Description: toggles the password visibility
    *
    ******************************************************************************/
    togglePassword = () => {
        let fa, pass;
        //toggle sign-in password field
        fa = document.getElementById("fa-in"); 
        pass = document.getElementById("pass-in");            
        
        
        if(fa.classList.contains("fa-eye")) {
            fa.classList.remove("fa-eye");
            fa.classList.add("fa-eye-slash");
            pass.type = "text";
        }
        else {
            fa.classList.remove("fa-eye-slash");
            fa.classList.add("fa-eye");
            pass.type = "password";
        }

    }

    /******************************************************************************
    * Name: compoentDidMount()
    *
    * Arguments: none
    *
    * Return: none
    *
    * Side-effects: none
    *
    * Description: initial settings for the components
    *
    ******************************************************************************/
    componentDidMount() {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('home-container');

        //add on-click event to sign-up button
        signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
        //add on-click event to sign-in button
        signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));
    }

    /******************************************************************************
    * Name: render()
    *
    * Arguments: none
    *
    * Return: none
    *
    * Side-effects: none
    *
    * Description: renders/displays the components on the page 
    *
    ******************************************************************************/
    render() {
        return(
            <div id="loginPage">
                <div className="home-container" id="home-container">
                    {/* sign-up */}
                    <div className="form-container sign-up-container">
                        <form onSubmit = {e => this.signup(e)}>
                            {/* success message when successful sign-up */}
                            <div id="succ-signup">
                                <h1>SUCCESSFUL!</h1>
                                {/* check mark animation */}
                                <div id="circle" class="circle-loader">
                                    <div id="mark" class="checkmark"></div>
                                </div>
                                <h5>You will receive an e-mail once your account has been checked</h5>
                            </div>
                            {/* sign-up form */}
                            <div id="signup-form">
                                <h1>Access request</h1>
                                {/* data input area */}
                                <div className = "data">
                                    {/* Name input field */}
                                    <div className="group">      
                                        <input id = "name-up" className="inputMaterial" type="text" pattern="[a-zA-z ]*$" placeholder=" " required />
                                        <span className="bar"></span>
                                        <label>Name (ex: John)</label>
                                    </div>
                                    {/* Surname input field */}
                                    <div className="group">      
                                        <input id = "surname-up" className="inputMaterial" type="text" pattern="[a-zA-z ]*$" placeholder=" " required />
                                        <span className="bar"></span>
                                        <label>Surname (ex: Doe)</label>
                                    </div>
                                    {/* E-mail input field */}
                                    <div className="group">      
                                        <input id = "email-up" className="inputMaterial" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder=" " required />
                                        <span className="bar email"></span>
                                        <label>Email (ex: example@{settings.name.substr(0, settings.name.indexOf(" ")).toLowerCase()}.com)</label>
                                    </div>
                                </div>
                                <button className = "level1" type = "submit">SIGN UP</button>
                            </div>
                        </form>
                    </div>
                    {/* sign-in */}
                    <div className="form-container sign-in-container">
                        <form onSubmit={e => this.login(e)}>
                            <h1>Sign in</h1>
                            {/* data input area */}
                            <div className = "data">
                                {/* Name input field */}
                                <div className="group">      
                                    <input id = "username-in" className="inputMaterial" type="text" pattern="[a-zA-z ]*$" placeholder=" " required />
                                    <span className="bar"></span>
                                    <label>Username (ex: {(settings.name.substr(0, settings.name.indexOf(" "))+settings.name.substr(settings.name.indexOf(" ")+1, settings.name.length)).toLowerCase()})</label>
                                </div>
                                {/* Password input field */}
                                <div className="group">      
                                    <input className="inputMaterial pass" id="pass-in" type="password" placeholder=" " required />
                                    <span className="fa-holder"><i id="fa-in" className="fa fa-pass fa-eye" onClick={() => this.togglePassword()}></i></span>
                                    <span className="bar pass"></span>
                                    <label>Password</label>
                                </div>
                            </div>
                            <a href="#" className="forgot-password">Forgot your password?</a>
                            <button className = "level1" type = "submit">SIGN IN</button>
                        </form>
                    </div>
                    {/* Slidding overlaying panel */}
                    <div className="overlay-container">
                        <div className="overlay">
                            {/* sign-up overlay panel */}
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To access your account please signin with your personal info</p>
                                <button className="level2" id="signIn">SIGN IN</button>
                            </div>
                            {/* sign-in overlay panel */}
                            <div className="overlay-panel overlay-right">
                                <h1>Welcome to <br/>{settings.name}</h1>
                                <p>Enter your personal details and start working with us</p>
                                <button className="level2" id="signUp">SIGN UP</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}
