

// -- Config --


const { ipcMain } = require('electron')
const path = require('path');
const fs = require('fs')


// Getters doesnt handle the correct 'this'
var lastModified
var noxPath
var scriptPath
var bashPath

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
        noxPath = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe')
        scriptPath = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script/deploy.sh')
        bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe')

        this.setupIPC()
    }

    getNoxPath() {
        return noxPath;
    }
    getScriptPath() {
        return scriptPath;
    }
    getBashPath() {
        return bashPath;
    }

    setupIPC() {
        ipcMain.on('readStorage', (event) => {
            console.log('readStorage');
            try {
                const fileJson = JSON.parse(fs.readFileSync(this.savePath));
                lastModified = path.normalize(fileJson.lastModified)
                noxPath = path.normalize(fileJson.nox)
                scriptPath = path.normalize(fileJson.script)
                bashPath = path.normalize(fileJson.bash)

                console.log(fileJson);

                const settings = {
                    lastModified: lastModified,
                    nox: noxPath,
                    script: scriptPath,
                    bash: bashPath
                };

                event.reply("newData", JSON.stringify(settings, null, 4))
            }
            catch (err) {
                alert("Could not read paths from Save File: " + err)
                this.resetPaths();
            }
        })


        ipcMain.on('updateData', (event, paths) => {
            console.log('updateData');
            noxPath = paths.nox
            scriptPath = paths.script
            bashPath = paths.bash
        })


        ipcMain.on('saveStorage', (event) => {
            console.log("saveStorage");

            lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
            const settings = {
                lastModified: lastModified,
                nox: noxPath,
                script: scriptPath,
                bash: bashPath
            };

            fs.writeFileSync(this.savePath, JSON.stringify(settings, null, 4), 'utf-8');
            event.reply("newData", JSON.stringify(settings, null, 4))
        })


        ipcMain.on('resetStorage', (event) => {
            console.log("resetStorage");
            try {
                this.resetPaths();

                lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
                const settings = {
                    lastModified: lastModified,
                    nox: noxPath,
                    script: scriptPath,
                    bash: bashPath
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
        noxPath = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe')
        scriptPath = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script/deploy.sh')
        bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe')
    }
}


module.exports = StorageHandler