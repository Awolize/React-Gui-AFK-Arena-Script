import React, { Component } from 'react'
import "./SaveHandler.css"

const { ipcRenderer } = window.require('electron');
const path = window.require("path");

export default class SaveHandler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastModified: "...",
            paths: {
                nox: "...",
                script: "...",
                bash: "..."
            },
            commands: {
                nox: "...",
                script: "..."
            },
            platform: "bluestacks"
        }
    }

    componentDidMount() {
        ipcRenderer.on("newData", (event, rawData) => {
            const saveData = JSON.parse(rawData);
            this.setState({
                lastModified: saveData.lastModified,
                paths: {
                    nox: saveData.nox,
                    script: saveData.script,
                    bash: saveData.bash
                },
                platform: saveData.platform
            })
        })

        ipcRenderer.on("showCommands", (event, rawData) => {
            const saveData = JSON.parse(rawData);
            this.setState({
                commands: {
                    nox: saveData.nox,
                    script: saveData.script
                }
            })
        })



        ipcRenderer.send("readStorage");
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('newData')
        ipcRenderer.removeAllListeners('showCommands')
    }


    handleChange() {
        ipcRenderer.send("updateData", { paths: this.state.paths });
    }

    handlePlatformChange(event) {
        console.log(event.target.value);
        this.setState({ platform: event.target.value });
        ipcRenderer.send("updatePlatformData", { platform: event.target.value });
    }

    render() {
        return (
            <section className="tab-content">
                <ul className="separator">
                    <li className="tile" id="outer">
                        <form className="box" id="inner">
                            <div id="file-nox-path" className="file has-name is-centered">
                                <div className="field">
                                    <label className="label">Nox Path</label>
                                    <label id="divBrowseNox">{this.state.paths.nox ? this.state.paths.nox : "-"}</label>
                                    <div className="file is-info has-name is-centered">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                onChange={(event) => {
                                                    this.setState({ paths: { nox: event.target.files[0].path } });
                                                    this.handleChange();
                                                }}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                                <span className="file-label"> Choose a file… </span>
                                            </span>
                                            <span className="file-name"> {path.basename(this.state.paths.nox) ? path.basename(this.state.paths.nox) : "No file uploaded"} </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </li>
                    <li className="tile" id="outer">
                        <form className="box" id="inner">
                            <div id="file-script-path" className="file has-name is-centered">
                                <div className="field">
                                    <label className="label">Script Path</label>
                                    <label id="divBrowseScript">{this.state.paths.script ? this.state.paths.script : "-"}</label>
                                    <div className="file is-info has-name is-centered">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                onChange={(event) => {
                                                    this.setState({ paths: { script: event.target.files[0].path } })
                                                    // this.handleChange();
                                                }}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                                <span className="file-label"> Choose a file… </span>
                                            </span>
                                            <span className="file-name"> {path.basename(this.state.paths.script) ? path.basename(this.state.paths.script) : "No file uploaded"} </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </li>
                    <li className="tile" id="outer">
                        <form className="box" id="inner">
                            <div id="file-bash-path" className="file has-name is-centered">
                                <div className="field">
                                    <label className="label">Bash Path</label>
                                    <label id="divBrowseBash">{this.state.paths.bash ? this.state.paths.bash : "-"}</label>
                                    <div className="file is-info has-name is-centered">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                onChange={(event) => {
                                                    this.setState({ paths: { bash: event.target.files[0].path } });
                                                    this.handleChange();
                                                }}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                                <span className="file-label"> Choose a file… </span>
                                            </span>
                                            <span className="file-name"> {path.basename(this.state.paths.bash) ? path.basename(this.state.paths.bash) : "No file uploaded"} </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </li>
                    <li className="tile">
                        <div className="select">
                            <select name="args" id="platform" value={this.state.platform} onChange={(event) => { this.handlePlatformChange(event) }}>
                                <option value="bluestacks">Bluestacks</option>
                                <option value="nox">Nox</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <p>{this.state.commands.nox}</p>
                        <p>{this.state.commands.script}</p>
                    </li>
                    <li>
                        <p>Save Last modified: {this.state.lastModified}</p>
                        <span> </span>
                        <button id="saveButton" className="button is-success" onClick={() => {
                            ipcRenderer.send('saveStorage');
                        }}>Save</button>
                        <span> </span>
                        <button id="resetButton" className="button is-warning" onClick={() => {
                            ipcRenderer.send('resetStorage')
                        }}>Reset</button>
                    </li>

                </ul>
            </section>)
    }
}