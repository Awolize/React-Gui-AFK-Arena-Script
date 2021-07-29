import React, { Component } from 'react'
import HTMLReactParser from 'html-react-parser';
const AU = window.require('ansi_up')
const ansi_up = new AU.default();

const { ipcRenderer } = window.require('electron');

import "./ScriptPage.css"

interface IProps {
    callback: ((ipcChannel: string) => void)
}

interface IState {
    text: string,
    status: string
}

export default class ScriptPage extends Component<IProps, IState> {
    private messagesEnd = React.createRef<HTMLDivElement>();
    constructor(props: IProps) {
        super(props)
        this.state = {
            text: "",
            status: ""
        }
        this.messagesEnd = React.createRef();
    }

    componentDidMount() {
        ipcRenderer.on("replay-script", (event: any, msg: string) => {
            this.appendOutput(msg)
        })
        ipcRenderer.on("replay-script-status", (event: any, msg: string) => {
            this.setState({ status: msg })
        })
        ipcRenderer.on("replay-nox", (event: any, msg: string) => {
            this.appendOutput(msg)
        })

        ipcRenderer.on("Mounted", (event: any, msg: string) => {
            this.clearScriptOutput()
            this.appendOutput(msg)
        })

        ipcRenderer.send('Mounted')
    }

    componentWillUnmount() {
        /* eslint-disable react/prop-types */
        if (this.props.callback)
            this.props.callback("Unmounted")
        /* eslint-enable react/prop-types */
        ipcRenderer.removeAllListeners('replay-script')
        ipcRenderer.removeAllListeners('replay-script-status')
        ipcRenderer.removeAllListeners('replay-nox')
        ipcRenderer.removeAllListeners('Mounted')
    }

    clearScriptOutput() {
        this.setState({ text: "", status: "" });
    }

    appendOutput(msg: any) {
        msg = msg.toString() // convert to string to prevent being object
        msg = ansi_up.ansi_to_html(msg)
        msg = msg.replace(/\n/g, '<br/>');
        this.setState(prevState => { return { text: prevState.text + msg } });
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        try {
            this.messagesEnd?.current?.scrollIntoView({ behavior: "auto" });
        }
        catch (e) {
            console.log(e);
        }
    }

    startNox() {
        ipcRenderer.send('startNox', "replay-nox")
    }

    startScript() {
        ipcRenderer.send('startScript', "replay-script")
    }

    render(): JSX.Element {
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
                        margin: "10px auto"
                    }}

                />
                <p id="status">Status: {this.state.status}</p>
                <div id="command-output" style={{ textAlign: "left" }}>
                    <div>{HTMLReactParser(this.state.text)}</div>
                    <div className="field"></div>
                    <div style={{ float: "left", clear: "both" }} ref={this.messagesEnd}>
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
