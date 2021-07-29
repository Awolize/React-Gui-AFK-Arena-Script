import React, { Component } from 'react'
import "./SchedulerPage.css"

interface IProps {
    callback: ((ipcChannel: string) => void)
}

interface IState {
    text: string,
    status: string
}

export default class SchedulerPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <p>Scheduler</p>
        )
    }
}