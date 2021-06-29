import React, { Component } from 'react'
import "./SaveHandler.css"

const path = window.require("path");
const fs = window.require("fs");

export default class SaveHandler extends Component {
    constructor(props) {
        super(props);
        this.state = { lastModified: this.props.lastModified }
    }

    resetState() {
        this.props.paths.nox = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe')
        this.props.paths.script = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script')
        this.props.paths.bash = path.normalize('C:/Program Files/Git/bin/sh.exe')
        this.handleChange();
    }

    resetStorage() {
        console.log("Resetting save file...");
        try {
            this.resetState();

            this.setState({ lastModified: new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString() })
            const settings = {
                lastModified: this.state.lastModified,
                nox: this.props.paths.nox,
                script: this.props.paths.script,
                bash: this.props.paths.bash,
            };
            fs.writeFileSync(this.props.savePath, JSON.stringify(settings, null, 4), 'utf-8');
            alert('Save file has been reset: ' + this.props.savePath);
        }
        catch (e) {
            alert('Failed saving to file:' + e);
        }
    }

    saveStorage() {
        console.log("Saving..");

        this.setState({ lastModified: new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString() })
        const settings = {
            lastModified: this.state.lastModified,
            nox: this.props.paths.nox,
            script: this.props.paths.script,
            bash: this.props.paths.bash
        };
        fs.writeFileSync(this.props.savePath, JSON.stringify(settings, null, 4), 'utf-8');
    }

    handleChange() {
        this.props.onPathsChange(this.state.lastModified, this.props.paths);
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
                                    <label id="divBrowseNox">{this.props.paths.nox ? this.props.paths.nox : "-"}</label>
                                    <div className="file is-info has-name is-centered">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                onChange={(event) => { this.props.paths.nox = event.target.files[0].path; this.handleChange(); }}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                                <span className="file-label"> Choose a file… </span>
                                            </span>
                                            <span className="file-name"> {path.basename(this.props.paths.nox) ? path.basename(this.props.paths.nox) : "No file uploaded"} </span>
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
                                    <label id="divBrowseScript">{this.props.paths.script ? this.props.paths.script : "-"}</label>
                                    <div className="file is-info has-name is-centered">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                onChange={(event) => { this.props.paths.script = event.target.files[0].path; this.handleChange(); }}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                                <span className="file-label"> Choose a file… </span>
                                            </span>
                                            <span className="file-name"> {path.basename(this.props.paths.script) ? path.basename(this.props.paths.script) : "No file uploaded"} </span>
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
                                    <label id="divBrowseBash">{this.props.paths.bash ? this.props.paths.bash : "-"}</label>
                                    <div className="file is-info has-name is-centered">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                onChange={(event) => { this.props.paths.bash = event.target.files[0].path; this.handleChange(); }}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                                <span className="file-label"> Choose a file… </span>
                                            </span>
                                            <span className="file-name"> {path.basename(this.props.paths.bash) ? path.basename(this.props.paths.bash) : "No file uploaded"} </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </li>
                    <li>
                        <p>Save Last modified: {this.state.lastModified}</p>
                        <span> </span>
                        <button id="saveButton" className="button is-success" onClick={() => this.saveStorage()}>Save</button>
                        <span> </span>
                        <button id="resetButton" className="button is-warning" onClick={() => this.resetStorage()}>Reset</button>
                    </li>

                </ul>
            </section>)
    }
}