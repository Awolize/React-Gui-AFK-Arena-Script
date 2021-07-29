

// -- Config --


const { ipcMain } = require('electron')
const path = require('path');
const fs = require('fs')


// Getters doesnt handle the correct 'this'
var lastModified
var platformPath
var scriptPath
var bashPath
var platformArg

class StorageHandler {
    constructor() {

        // Get save path
        // ----------------------------------------------------------------------
        const remote = require('electron').remote;
        const { app } = require('electron');
        const userDataPath = (app || remote.app).getPath('userData');
        this.savePath = path.join(userDataPath, 'save.json');
        console.log("savePath: " + this.savePath);
        // ----------------------------------------------------------------------


        lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString()
        platformPath = path.normalize('C:/Program Files (x86)/Platform/bin/Platform.exe')
        scriptPath = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script/deploy.sh')
        bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe')
        platformArg = "bluestacks"

        this.setupIPC()
    }

    getPlatformPath() {
        return platformPath;
    }
    getScriptPath() {
        return scriptPath;
    }
    getBashPath() {
        return bashPath;
    }

    getCommands(event) {
        console.log(this.getPlatformPath());
        let platformPath = this.getPlatformPath().replaceAll('\\', '/');
        let platformCommand = `"${platformPath}"`

        let scriptDir = path.dirname(this.getScriptPath()).replaceAll('\\', '/')
        let scriptName = path.basename(this.getScriptPath()).replaceAll('\\', '/')

        let args = ""
        if (platformArg == "bluestacks")
            args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -bs"`]
        else
            args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -n"`]

        let scriptCommand = `"${this.getBashPath().replaceAll('\\', '/')}"` + " " + args


        event.reply('showCommands', JSON.stringify({ platform: platformCommand, script: scriptCommand }, null, 4))
    }

    setupIPC() {
        ipcMain.on('readStorage', (event) => {
            console.log('readStorage');
            try {
                const fileJson = JSON.parse(fs.readFileSync(this.savePath));
                lastModified = path.normalize(fileJson.lastModified)
                platformPath = path.normalize(fileJson.platform)
                scriptPath = path.normalize(fileJson.script)
                bashPath = path.normalize(fileJson.bash)
                platformArg = fileJson.platformArg

                console.log(fileJson);

                const settings = {
                    lastModified: lastModified,
                    platform: platformPath,
                    script: scriptPath,
                    bash: bashPath,
                    platformArg: platformArg
                };

                event.reply("newData", JSON.stringify(settings, null, 4))
                this.getCommands(event)
            }
            catch (err) {
                console.error("Could not read paths from Save File: " + err)
                this.resetPaths();
            }
        })

        ipcMain.on('updateData', (event, paths) => {
            console.log("----------------------");
            console.log('updateData: ', paths);

            platformPath = paths.platform;
            scriptPath = paths.script;
            bashPath = paths.bash;

            console.log(platformPath, scriptPath, bashPath);

            this.getCommands(event)
        })

        ipcMain.on('updatePlatformData', (event, data) => {
            console.log('updatePlatformData');
            platformArg = data.platform

            this.getCommands(event)
        })


        ipcMain.on('saveStorage', (event) => {
            console.log("saveStorage");

            lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
            const settings = {
                lastModified: lastModified,
                platform: platformPath,
                script: scriptPath,
                bash: bashPath,
                platformArg: platformArg
            };

            fs.writeFileSync(this.savePath, JSON.stringify(settings, null, 4), 'utf-8');
            event.reply("newData", JSON.stringify(settings, null, 4))

            console.log(this.savePath);
        })


        ipcMain.on('resetStorage', (event) => {
            console.log("resetStorage");
            try {
                this.resetPaths();

                lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
                const settings = {
                    lastModified: lastModified,
                    platform: platformPath,
                    script: scriptPath,
                    bash: bashPath,
                    platformArg: platformArg
                };

                fs.writeFileSync(this.savePath, JSON.stringify(settings, null, 4), 'utf-8');
                console.log('Save file has been reset: ' + this.savePath);
                event.reply("newData", JSON.stringify(settings, null, 4))
            }
            catch (e) {
                console.log('Failed saving to file:' + e);
            }
        })
    }

    resetPaths() {
        platformPath = path.normalize('C:/Program Files (x86)/Platform/bin/Platform.exe')
        scriptPath = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script/deploy.sh')
        bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe')
        platformArg = "bluestacks"
    }
}


module.exports = StorageHandler