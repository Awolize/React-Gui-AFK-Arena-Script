import React, { Component } from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bulma/css/bulma.min.css';

import SaveHandler from "./SaveHandler";
import RunScript from "./RunScript";

const electron = window.require('electron');
const path = window.require("path");
const fs = window.require("fs");

export default class TabsContent extends Component {
    constructor(props) {
        super(props);
        this.state = { lastModified: new Date(), paths: { nox: "null", script: "null", bash: "null" } };
        this.handlePathsChange = this.handlePathsChange.bind(this);

        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        this.savePath = path.join(userDataPath, 'save.json');
        this.readStorage();
    }

    handlePathsChange(modified, paths) {
        this.setState({ lastModified: modified, paths: paths });
    }

    resetState() {
        this.state.paths.nox = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe')
        this.state.paths.script = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script')
        this.state.paths.bash = path.normalize('C:/Program Files/Git/bin/sh.exe')
    }

    readStorage() {
        try {
            const fileJson = JSON.parse(fs.readFileSync(this.savePath));
            this.state.lastModified = path.normalize(fileJson.lastModified)
            this.state.paths.nox = path.normalize(fileJson.nox)
            this.state.paths.script = path.normalize(fileJson.script)
            this.state.paths.bash = path.normalize(fileJson.bash)
            return true
        }
        catch (err) {
            alert("Could not read paths from Save File: " + err)
            this.resetState();
            return false
        }
    }

    render() {

        const paths = this.state.paths;
        const lastModified = this.state.lastModified

        return (
            <div>
                <Tabs>
                    <TabList>
                        <Tab>Run</Tab>
                        <Tab>Settings</Tab>
                        <Tab>Edit Config</Tab>
                    </TabList>
                    <TabPanel>
                        <RunScript
                            paths={paths}
                        />
                    </TabPanel>
                    <TabPanel>
                        <SaveHandler
                            paths={paths}
                            lastModified={lastModified}
                            savePath={this.savePath}
                            onPathsChange={this.handlePathsChange}
                        />
                    </TabPanel>
                    <TabPanel>
                        <section className="tab-content">
                            <div id="configFileTitles">titles file</div>
                            <textarea
                                id="configFileContent"
                                className="textarea"
                                placeholder="Start writing here mf.."
                            ></textarea>
                        </section>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}