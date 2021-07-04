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
        ipcRenderer.send("readConfig");
    }
    writeConfigFile(data) {
        ipcRenderer.send("writeConfig", data);
    }

    handleChange(event) {
        console.log("new change");
        this.setState({ text: event.target.value })
        this.writeConfigFile(event.target.value)
    }


    render() {
        return (
            <section className="tab-content">
                <textarea
                    id="configFileContent"
                    className="textarea"
                    placeholder="Start writing here.."
                    value={this.state.text}
                    onChange={(event) => this.handleChange(event)}
                />
            </section>
        )
    }
}