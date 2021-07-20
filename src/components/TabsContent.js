import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bulma/css/bulma.min.css';

import SaveHandler from "./SaveHandler/SaveHandler";
import ConfigEditor from "./ConfigEditor/ConfigEditor";
import Scheduler from "../pages/SchedulerPage/SchedulerPage";
import RunScript from "./RunScript/RunScript";

const { ipcRenderer } = window.require('electron');

function callback(msg) {
    ipcRenderer.send(msg)
}


export default class TabsContent extends Component {
    render() {
        return (
            <div>
                <Tabs>
                    <TabList>
                        <Tab>Run</Tab>
                        <Tab>Scheduler</Tab>
                        <Tab>Settings</Tab>
                        <Tab>Edit Config</Tab>
                    </TabList>


                    <TabPanel>
                        <RunScript callback={callback} />
                    </TabPanel>

                    <TabPanel>
                        <Scheduler />
                    </TabPanel>

                    <TabPanel>
                        <SaveHandler />
                    </TabPanel>

                    <TabPanel>
                        <ConfigEditor />
                    </TabPanel>

                </Tabs>
            </div>
        );
    }
}