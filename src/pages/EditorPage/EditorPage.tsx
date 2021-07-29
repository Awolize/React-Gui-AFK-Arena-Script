import React, { Component } from 'react'
import "./EditorPage.css"

const { ipcRenderer } = window.require('electron');

interface IProps { }

interface IState {
    lastModified: Date | string,
    text: string
}

export default class EditorPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            lastModified: "...",
            text: "..."
        }
    }

    componentDidMount(): void {
        ipcRenderer.on("readConfig", (event: unknown, data: string) => {
            this.setState({ text: data })
        })

        this.readConfigFile()
    }

    componentWillUnmount(): void {
        ipcRenderer.removeAllListeners('readConfig')
    }

    readConfigFile(): void {
        ipcRenderer.send("readConfig");
    }
    writeConfigFile(data: string): void {
        ipcRenderer.send("writeConfig", data);
    }

    handleChange(event: any): void {
        this.setState({ text: event.target.value })
        this.writeConfigFile(event.target.value)
    }


    render(): JSX.Element {
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