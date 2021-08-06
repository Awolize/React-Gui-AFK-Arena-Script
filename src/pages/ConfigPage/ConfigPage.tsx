import React, { Component } from 'react'
import "./ConfigPage.css"

const { ipcRenderer } = window.require('electron');
const path = window.require("path");

interface IProps { }

interface IPaths {
    platform: string,
    script: string,
    bash: string
}

interface ICommandData {
    platform: string,
    script: string
}

interface IState {
    lastModified: Date | string,
    paths: IPaths,
    commands: ICommandData,
    platformArg: string
}


export default class ConfigPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            lastModified: "",
            paths: {
                platform: "",
                script: "",
                bash: ""
            },
            commands: {
                platform: "",
                script: ""
            },
            platformArg: "bluestacks"
        }
    }

    componentDidMount() {
        ipcRenderer.on("newData", (event: any, saveData: IState) => {
            this.setState({
                lastModified: saveData.lastModified,
                paths: {
                    platform: saveData.paths.platform,
                    script: saveData.paths.script,
                    bash: saveData.paths.bash
                },
                commands: {
                    platform: saveData.commands.platform,
                    script: saveData.commands.script
                },
                platformArg: saveData.platformArg
            })
        })

        ipcRenderer.send("readStorage");
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('newData')
        ipcRenderer.removeAllListeners('showCommands')
    }


    handleChange() {
        console.log("Sending paths:", this.state.paths);

        ipcRenderer.send("updateData", this.state.paths);
    }

    handlePlatformChange(event: any) {
        console.log(event.target.value);
        this.setState({ platformArg: event.target.value });
        ipcRenderer.send("updatePlatformData", { platform: event.target.value });
    }

    render() {
        return (
            <section className="tab-content">
                <ul className="separator">
                    <li className="tile" id="outer">
                        <form className="box" id="inner">
                            <div id="file-platform-path" className="file has-name is-centered">
                                <div className="field">
                                    <label className="label">Platform Path</label>
                                    <label id="divBrowsePlatform">{this.state.paths.platform ? this.state.paths.platform : "-"}</label>
                                    <div className="file is-info has-name is-centered">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                onChange={(event: any) => {
                                                    event.persist()
                                                    console.log("New platform path:", event.target.files[0].path);

                                                    this.setState(prevState => ({
                                                        paths: {
                                                            ...prevState.paths,
                                                            platform: event.target.files[0].path,
                                                        }
                                                    }), this.handleChange)

                                                }}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                                <span className="file-label"> Choose a file… </span>
                                            </span>
                                            <span className="file-name"> {path.basename(this.state.paths.platform) ? path.basename(this.state.paths.platform) : "No file uploaded"} </span>
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
                                                onChange={(event: any) => {
                                                    event.persist()
                                                    console.log("New script path:", event.target.files[0].path);

                                                    this.setState(prevState => ({
                                                        paths: {
                                                            ...prevState.paths,
                                                            script: event.target.files[0].path,
                                                        }
                                                    }), this.handleChange)
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
                                                onChange={(event: any) => {
                                                    event.persist()
                                                    console.log("New bash path:", event.target.files[0].path);

                                                    this.setState(prevState => ({
                                                        paths: {
                                                            ...prevState.paths,
                                                            bash: event.target.files[0].path,
                                                        }
                                                    }), this.handleChange)
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
                            <select name="args" id="platform" value={this.state.platformArg} onChange={(event) => { this.handlePlatformChange(event) }}>
                                <option value="bluestacks">Bluestacks</option>
                                <option value="nox">Nox</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <p>{this.state.commands.platform}</p>
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