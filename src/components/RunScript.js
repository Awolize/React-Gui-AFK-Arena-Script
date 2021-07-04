import React, { Component } from 'react'
import HTMLReactParser from 'html-react-parser';
const AU = window.require('ansi_up')
const ansi_up = new AU.default();

const { ipcRenderer } = window.require('electron');

export default class RunScript extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "",
            status: ""
        }
    }

    componentDidMount() {
        ipcRenderer.on("replay-script", (event, msg) => {
            this.appendOutput(msg)
        })
        ipcRenderer.on("replay-nox", (event, msg) => {
            this.appendOutput(msg)
        })
    }

    clearScriptOutput() {
        this.setState({ text: "", status: "" });
    }

    appendOutput(msg) {
        msg = msg.toString() // convert to string to prevent being object
        msg = ansi_up.ansi_to_html(msg)
        msg = msg.replace(/\n/g, '<br/>');
        this.setState(prevState => { return { text: prevState.text + msg } });
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }

    startNox() {
        ipcRenderer.send('startNox', "replay-nox")
    }

    startScript() {
        ipcRenderer.send('startScript', "replay-script")
    }

    render() {
        return (
            <section className="tab-content">
                <button id="btnStartNox" className="button is-success" onClick={() => this.startNox()}>
                    Start Nox
                </button>
                <span> </span>
                <button id="btnStartScript" className="button is-success" onClick={() => this.startScript()}>
                    Run Script
                </button>
                <hr
                    style={{
                        height: "2px",
                        borderWidth: "0",
                        width: "50%",
                        margin: "30px auto"
                    }}

                />
                <p id="status">Status: {this.state.status}</p>
                <div id="command-output" style={{ textAlign: "left" }}>
                    <div>{HTMLReactParser(this.state.text)}</div>
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                        {' '}
                    </div>
                </div>

                <button
                    id="clearLogs"
                    className="button is-warning"
                    style={{ marginTop: "10px" }}
                    onClick={() => this.clearScriptOutput()}
                >
                    Clear
                </button>
            </section>

        )
    }
}
