import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser';
const path = window.require("path");
var childProcess = window.require("child_process");
const { dialog } = window.require('@electron/remote');
const AU = window.require('ansi_up')
const ansi_up = new AU.default;


export default class RunScript extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "",
            status: ""
        }
    }

    clearScriptOutput() {
        this.setState({ text: "", status: "" });
    }

    appendOutput(msg) {
        msg = msg + "\n" // convert to string to prevent being object
        msg = ansi_up.ansi_to_html(msg)
        msg = msg.replace(/\n/g, '<br/>');
        this.setState(prevState => { return { text: prevState.text + msg } });
        this.scrollToBottom()
    };
    setStatus(msg) {
        this.setState({ status: msg });
        this.scrollToBottom()
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }



    startNox() {
        //command, args, callback
        console.log(this.props.paths.nox);

        let noxPath = this.props.paths.nox;
        this.run_script(`"${noxPath.replaceAll('\\', '/')}"`);
        return;
    }

    startScript() {
        //command, args, callback
        let bashPath = this.props.paths.bash;
        let scriptDir = path.dirname(this.props.paths.script).replaceAll('\\', '/')
        let scriptName = path.basename(this.props.paths.script).replaceAll('\\', '/')
        let args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -n"`]
        //"C:\Program Files\Git\bin\sh.exe" - c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

        this.run_script(`"${bashPath.replaceAll('\\', '/')}"`, args);
        return;
    }

    run_script(command, args, callback) {

        var child = childProcess.spawn(command, args, {
            encoding: "utf8",
            shell: true,
        });

        console.log('spawn called');
        console.log(command);
        console.log(args);

        // var child = child_process.spawn(command, args, {
        //     encoding: "utf8",
        //     shell: false,
        // });
        // You can also use a variable to save the output for when the script closes later
        child.on("error", (error) => {
            error = error.toString();
            this.appendOutput(error);
            dialog.showMessageBox({
                title: "Title",
                type: "warning",
                message: "Error occured.\r\n" + error,
            });
        });

        child.stdout.on("data", (data) => {
            //Here is the output
            data = data.toString();
            console.log(data);
            this.appendOutput(data);
        });

        child.stderr.on("data", (data) => {
            //Here is the output from the command
            data = data.toString();
            this.appendOutput(data);
        });

        child.on("close", (code) => {
            this.setStatus("Process ended:" + code);
        });
        if (typeof callback === "function") callback();
    }

    render() {

        return (
            <section className="tab-content">
                <button id="btnStartNox" className="button is-success" onClick={() => this.startNox()}>
                    Start Nox
                </button>
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
                    <div>{ReactHtmlParser(this.state.text)}</div>
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
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
