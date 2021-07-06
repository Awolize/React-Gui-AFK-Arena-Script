import React, { Component } from 'react'
import "./Scheduler.css"


export default class Scheduler extends Component {
    constructor(props) {
        super(props);
        console.log("Scheduler constructor");
    }

    render() {
        return (
            <p>Scheduler</p>
        )
    }
}