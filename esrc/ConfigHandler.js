// -- Config --


const { ipcMain } = require('electron')
const path = require('path');
const fs = require('fs')

class ConfigHandler {
    constructor(getScriptPath) {
        this.getScriptPath = () => { return getScriptPath.call() }

        ipcMain.on('readConfig', (event) => {
            console.log('readConfig');
            try {
                let configPath = path.dirname(this.getScriptPath()) + "/config.sh"
                console.log(configPath);
                fs.readFile(configPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    event.reply("readConfig", data)
                })
            }
            catch (err) {
                console.error("Couldnt read config file: " + err);
            }
        })

        ipcMain.on('writeConfig', (event, data) => {
            console.log('writeConfig');
            try {
                let configPath = path.dirname(this.getScriptPath()) + "/config.sh"
                console.log(configPath);
                fs.writeFile(configPath, data, err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            }
            catch (err) {
                console.error("Couldnt writeConfig Config file: " + err);
            }
        })
    }
}


module.exports = ConfigHandler