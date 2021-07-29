import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bulma/css/bulma.min.css';

import ScriptPage from "../pages/ScriptPage/ScriptPage";
import ConfigPage from "../pages/ConfigPage/ConfigPage";
import SchedulerPage from "../pages/SchedulerPage/SchedulerPage";
import EditorPage from "../pages/EditorPage/EditorPage";

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
                        <ScriptPage callback={callback} />
                    </TabPanel>

                    <TabPanel>
                        <SchedulerPage />
                    </TabPanel>

                    <TabPanel>
                        <ConfigPage />
                    </TabPanel>

                    <TabPanel>
                        <EditorPage />
                    </TabPanel>

                </Tabs>
            </div>
        );
    }
}