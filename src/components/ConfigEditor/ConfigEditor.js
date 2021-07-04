import React, { Component } from 'react'
import "./ConfigEditor.css"

const { ipcRenderer } = window.require('electron');

export default class ConfigEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastModified: "[Loading..]",
            text: "[Loading..]"
        }

        ipcRenderer.on("readConfig", (event, data) => {
            this.setState({ text: data })
            console.log(data);
        })

        this.readConfigFile()
    }

    readConfigFile() {
        ipcRenderer.send("readConfig", this.state.paths);
    }
    writeConfigFile() {
        ipcRenderer.send("writeConfig", this.state.paths);
    }

    handleChange(event, data) {
        console.log("new change");
        console.log(event);
        console.log(data);
    }


    render() {
        return (
            <section className="tab-content">
                <textarea
                    id="configFileContent"
                    className="textarea"
                    placeholder="Start writing here.."
                    value={this.state.text}
                    onChange={this.handleChange}
                />
            </section>
        )
    }
}