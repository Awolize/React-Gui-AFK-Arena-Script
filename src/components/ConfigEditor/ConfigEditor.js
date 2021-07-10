import React, { Component } from 'react'
import "./ConfigEditor.css"

const { ipcRenderer } = window.require('electron');

export default class ConfigEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastModified: "...",
            text: "..."
        }
    }

    componentDidMount() {
        ipcRenderer.on("readConfig", (event, data) => {
            this.setState({ text: data })
        })

        this.readConfigFile()
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('readConfig')
    }

    readConfigFile() {
        ipcRenderer.send("readConfig");
    }
    writeConfigFile(data) {
        ipcRenderer.send("writeConfig", data);
    }

    handleChange(event) {
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