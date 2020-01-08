import React, { Component } from 'react';
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import './styles.scss';

const modifiersStyles = {
    outside: {
        backgroundColor: 'transparent',
    },
};

class PlanEl extends Component { 
    modifiers = {
        special: undefined,
        disabled: {from: new Date(1900), to: new Date()},
        selected: {from:  undefined, to: undefined},
    }

    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {
            selectedDay1: undefined,
            selectedDay2: undefined,
            button: 1
        };
    }

    handleDayClick = (day, { selected, disabled }) => {
        if (disabled) {
            return;
        }
        switch(this.state.button) {
            case 1:
                if(selected) {
                    this.setState({ selectedDay1: undefined });
                    this.modifiers.selected.from = undefined;
                    this.modifiers.selected.to = undefined;
                }
                else {
                    this.setState({ selectedDay1: day });
                    this.modifiers.selected.from = day;
                    this.modifiers.selected.to = day;
                }
                break;
            case 2:
                if(selected) {
                    if(day.getTime() === this.state.selectedDay1.getTime()) {
                        this.setState({ selectedDay1: undefined});
                        this.modifiers.selected.from = undefined;
                        this.modifiers.special = this.state.selectedDay2
                    }
                    else if(day.getTime() === this.state.selectedDay2.getTime()) {
                        this.setState({ selectedDay1: day});
                        this.modifiers.selected.from = day; 
                        let d = new Date(
                            day.getFullYear(), 
                            day.getMonth(), 
                            day.getDate() + 1, 
                            day.getHours(), 
                            day.getMinutes(), 
                            day.getSeconds());
                        this.setState({ selectedDay2: d});
                        this.modifiers.selected.to = d;
                        this.modifiers.special = undefined
                    }
                    else {
                        this.setState({ selectedDay1: day });
                        this.modifiers.selected.from = day;
                    }
                } 
                else {
                    if (this.state.selectedDay2 && day.getTime() >= this.state.selectedDay2.getTime()) {
                        this.setState({ selectedDay1: day});
                        this.modifiers.selected.from = day; 
                        let d = new Date(
                            day.getFullYear(), 
                            day.getMonth(), 
                            day.getDate() + 1, 
                            day.getHours(), 
                            day.getMinutes(), 
                            day.getSeconds());
                        this.setState({ selectedDay2: d});
                        this.modifiers.selected.to = d;
                        this.modifiers.special = undefined
                    }
                    else if(this.state.selectedDay1 && day.getTime() === this.state.selectedDay1.getTime()) {
                        this.setState({ selectedDay1: undefined});
                        this.modifiers.selected.from = undefined;
                        if(this.state.selectedDay2) {
                            this.modifiers.special = this.state.selectedDay2
                        }
                        else {
                            this.modifiers.special = undefined
                        }
                    }
                    else {
                        this.setState({ selectedDay1: day});
                        this.modifiers.selected.from = day; 
                        if(this.state.selectedDay2 === undefined) {
                            let d = new Date(
                                day.getFullYear(), 
                                day.getMonth(), 
                                day.getDate() + 1, 
                                day.getHours(), 
                                day.getMinutes(), 
                                day.getSeconds());
                            this.setState({ selectedDay2: d});
                            this.modifiers.selected.to = d;
                        }
                        this.modifiers.special = undefined
                    }
                }
                break;
            case 3:
                if(selected) {
                    if(day.getTime() === this.state.selectedDay2.getTime()) {
                        this.setState({ selectedDay2: undefined});
                        this.modifiers.selected.to = undefined;
                        this.modifiers.special = this.state.selectedDay1
                    }
                    else {
                        this.setState({ selectedDay2: day });
                        this.modifiers.selected.to = day;
                    }
                }
                else {
                    if(this.state.selectedDay2 && day.getTime() === this.state.selectedDay2.getTime()) {
                        this.setState({ selectedDay2: undefined});
                        this.modifiers.selected.to = undefined;
                        if(this.state.selectedDay1) {
                            this.modifiers.special = this.state.selectedDay1
                        }
                        else {
                            this.modifiers.special = undefined
                        }
                        
                    }
                    else {
                        this.setState({ selectedDay2: day});
                        this.modifiers.selected.to = day; 
                        if(this.state.selectedDay1 === undefined) {
                            let d = new Date(
                                day.getFullYear(), 
                                day.getMonth(), 
                                day.getDate() - 1, 
                                day.getHours(), 
                                day.getMinutes(), 
                                day.getSeconds());
                            this.setState({ selectedDay1: d});
                            this.modifiers.selected.from = d;
                        }
                        this.modifiers.special = undefined
                    }
                }
                break;
        }

        this.switchDayDisplay()
        return
    }

    switchDayDisplay = (n) => {
        let picker = document.querySelectorAll(".DayPicker");
        if(picker) {
            for(var i = 0; i< picker.length; i++){ 
                if(picker[i].parentElement.getAttribute("index") == this.props.index){
                    if(picker[i].style.display == 'none' || picker[i].style.display == "") {
                        picker[i].style.display = 'inline-block'
                    }
                    else {
                        picker[i].style.display = 'none'
                    }
                }
                else {
                    picker[i].style.display = 'none';
                }
            }
        }

        if(n == 2) {
            this.modifiers.disabled.to = new Date();
        }
        else if (n == 3){
            if(this.state.selectedDay1) {
                this.modifiers.disabled.to = this.state.selectedDay1;
            }
            else{
                let d = new Date;
                d.setDate(d.getDate() + 1)
                this.modifiers.disabled.to = d;
            }
        }
        
        this.setState({button: n})
    }

    componentDidMount() {
        window.addEventListener("click", function(el){ 
            let aux = el.target, valid = true;
            while(aux.className != "App") {       
                if(aux.className === "DayPicker") valid = false;
                aux = aux.parentElement;
                if(!aux) break;
            }
            if(el.target.className.split(" ")[0] !== "dateHolder" && valid){
                const picker = document.querySelectorAll(".DayPicker");
                if(picker) {
                    for(var i = 0; i< picker.length; i++){
                        picker[i].style.display = 'none';
                    }
                }
            }
        })
    }

    render() {
        return(
            <div className = "planEl" >
                <div class='row level1'>
                    <div class='column level1'>
                        <span>Date</span>
                    </div>
                    <div class='column level2'>
                        <span>Description</span>
                    </div>
                    <div class='column level1'>
                        <span>Manager</span>
                    </div>
                </div>
                <div class='row level3'></div>
                <div class='row level2'>
                        {this.props.mode === "2" ? (
                            <div class='column level1' index = {this.props.index}>
                                <div class='row level1'>
                                    From: <button className = "dateHolder level2" onClick = {() => this.switchDayDisplay(2)}>
                                        {this.state.selectedDay1 ? (
                                            this.state.selectedDay1.toLocaleDateString()
                                        ) : (
                                            "DD/MM/YYYY"
                                        )}
                                    </button>
                                </div>
                                <div class='row level1'>
                                    To: <button className = "dateHolder level2" onClick = {() => this.switchDayDisplay(3)}>
                                        {this.state.selectedDay2 ? (
                                            this.state.selectedDay2.toLocaleDateString()
                                        ) : (
                                            "DD/MM/YYYY"
                                        )}
                                    </button>
                                </div>
                                <DayPicker
                                    onDayClick={this.handleDayClick}
                                    selectedDays={this.state.selectedDay}
                                    modifiers={this.modifiers}
                                    modifiersStyles={modifiersStyles}
                                    firstDayOfWeek={6}
                                />
                            </div>
                        ) : (
                            <div class='column level1' index = {this.props.index}>
                                <button className = "dateHolder level2" onClick = {() => this.switchDayDisplay(1)}>
                                    {this.state.selectedDay1 ? (
                                        this.state.selectedDay1.toLocaleDateString()
                                    ) : (
                                        "DD/MM/YYYY"
                                    )}
                                </button>
                                <DayPicker
                                    onDayClick={this.handleDayClick}
                                    selectedDays={this.state.selectedDay}
                                    modifiers={this.modifiers}
                                    modifiersStyles={modifiersStyles}
                                    firstDayOfWeek={6}
                                />
                            </div>
                        )}
                    <div class='column level2'>
                        <textarea className = "description" contentEditable = "true" placeholder = "Insert a description"></textarea>
                    </div>
                    <div class='column level1'>
                    <textarea className = "description" contentEditable = "true" placeholder = "Insert the manager's name"></textarea>
                    </div>
                </div>
            </div>
        )
    }
     
}


export default class Plan extends Component {
    
    state = {
        elements: [],
        element_num: 0, 
        name: undefined
    }
    
    newElement = (m) => {
        this.state.elements.push(<PlanEl mode = {m} index = {this.state.element_num}/>)
        this.setState({element_num: this.state.element_num + 1});
    }

    componentDidMount() {
        let name = decodeURIComponent(window.location.href.substring(window.location.href.lastIndexOf('/') + 1))
        this.setState({name})
    }

    render() {
        return(
            <div id = "plan">
                <h4>{this.state.name}</h4>
                {this.state.elements.map(element => element)}
                <div className = "buttonContainer">
                    <button className = "level2" onClick = {() => this.newElement("1")}>Add single day event</button>
                    <button className = "level2" onClick = {() => this.newElement("2")}>Add multi day event</button>
                </div>
            </div>
        )
    }
}