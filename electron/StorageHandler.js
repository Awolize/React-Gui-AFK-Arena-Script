const { ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

// Getters doesnt handle the correct 'this'
var lastModified
var platformPath
var scriptPath
var bashPath
var platformArg

class StorageHandler {
    constructor() {

        const remote = require('electron').remote;
        const { app } = require('electron');
        const savePath = (app || remote.app).getPath('userData');
        this.saveFile = path.join(savePath, 'save.json');
        console.log("saveFile: " + this.saveFile);


        lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString()
        platformPath = path.normalize('C:/Program Files (x86)/Platform/bin/Platform.exe')
        scriptPath = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script/deploy.sh')
        bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe')
        platformArg = "bluestacks"


        this.readSave();
        this.setupIPC()
    }

    // --------------------
    // Get hooks for other classes
    // --------------------
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

    // --------------------
    // IPC Handling
    // --------------------
    setupIPC() {
        ipcMain.on('readStorage', (event) => {
            console.log('IPC - readStorage');

            this.readSave();

            this.sendData(event, "newData");

        })

        ipcMain.on('updateData', (event, paths) => {
            console.log('IPC - updateData: ', paths);
            console.log("> data: ", paths);

            platformPath = paths.platform;
            scriptPath = paths.script;
            bashPath = paths.bash;

            this.sendData(event, "newData");
        })

        ipcMain.on('updatePlatformData', (event, data) => {
            console.log('IPC - updatePlatformData');
            console.log("> data: ", data);

            platformArg = data.platform

            this.sendData(event, "newData");
        })


        ipcMain.on('saveStorage', (event) => {
            console.log("IPC - saveStorage");

            this.writeSave();

            this.sendData(event, "newData");
        })


        ipcMain.on('resetStorage', (event) => {
            console.log("IPC - resetStorage");

            this.clearSave();

            this.sendData(event, "newData");
        })
    }

    // --------------------
    // Save Handling
    // --------------------
    readSave() {
        if (fs.existsSync(this.saveFile)) {
            const fileJson = JSON.parse(fs.readFileSync(this.saveFile));
            lastModified = path.normalize(fileJson.lastModified)
            platformPath = path.normalize(fileJson.platform)
            scriptPath = path.normalize(fileJson.script)
            bashPath = path.normalize(fileJson.bash)
            platformArg = fileJson.platformArg
        }
        else {
            console.error("Could not read saveFile");
        }

        // log variables
        console.log("lastModified: " + lastModified);
        console.log("platformPath: " + platformPath);
        console.log("scriptPath: " + scriptPath);
        console.log("bashPath: " + bashPath);
        console.log("platformArg: " + platformArg);
    }
    writeSave() {
        // write variables to file in json format
        const saveJson = JSON.stringify({
            lastModified: lastModified,
            platform: platformPath,
            script: scriptPath,
            bash: bashPath,
            platformArg: platformArg,
        }, null, 4);
        fs.writeFileSync(this.saveFile, saveJson, { encoding: 'utf-8' });
    }
    clearSave() {
        console.log("Resetting Save");
        this.resetPaths();
        this.writeSave();
    }

    // --------------------
    // Helper Functions
    // --------------------
    sendData(event, channel) {
        const save = {
            lastModified: lastModified,
            platform: platformPath,
            script: scriptPath,
            bash: bashPath,
            platformArg: platformArg,
        };
        event.reply(channel, save)


        this.getCommands(event)
    }

    resetPaths() {
        lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
        platformPath = ""
        scriptPath = ""
        bashPath = ""
        platformArg = "bluestacks"
    }
}

module.exports = StorageHandler