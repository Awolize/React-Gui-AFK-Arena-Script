import React, { Component } from 'react'
import "./SchedulerPage.css"

const { ipcRenderer } = window.require('electron');


interface IProps {
    callback: ((ipcChannel: string) => void)
}

interface IState {
    lastModified: Date | string,
    schedule: string,
    validation: string
}

export default class SchedulerPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            lastModified: "",
            schedule: "",
            validation: "white"
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(): void {
        ipcRenderer.on("SchedulerPageMounted", (event: any, msg: IState) => {

            console.log(msg);

            this.setState({
                lastModified: msg.lastModified,
                schedule: msg.schedule
            })
            console.log("SchedulerPageMounted", msg);
        })

        ipcRenderer.send('SchedulerPageMounted')
    }

    componentWillUnmount(): void {
        ipcRenderer.removeAllListeners('SchedulerPageMounted')
    }

    handleSubmit(event: any) {
        event.preventDefault();
        if (this.state.validation == "red") {
            console.log('validator does not recommend: ' + this.state.schedule);
        }
        console.log('Crontab was submitted: ' + this.state.schedule);
        ipcRenderer.send('SchedulerPageSave', this.state.schedule);
    }

    render(): JSX.Element {
        return (
            <div style={{
                fontSize: "16px",
            }}>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Crontab
                        <input type="text"
                            value={this.state.schedule}
                            onChange={(event: any) => {
                                event.persist()
                                const re = new RegExp(/^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?) ?){5,7})$|(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)/);
                                this.setState({ schedule: event.target.value });

                                if (event.target.value.match(re) != null) {
                                    this.setState({ validation: "white" });
                                }
                                else {
                                    this.setState({ validation: "red" });
                                }
                            }}

                            style={{
                                border: "none",
                                background: this.state.validation,
                                textAlign: 'center',
                                borderRadius: "5px",
                                fontSize: "16px",
                            }}
                        />
                    </label>
                    <input type="submit" value="Save"
                        style={{
                            border: "none",
                        }}
                    />
                </form>
                <p style={{
                    fontSize: "12px",
                }}>regex validator is not perfect and your cron expression might still work</p>
                <p>Last Changed: {this.state.lastModified}</p>
            </div>
        )
    }
}