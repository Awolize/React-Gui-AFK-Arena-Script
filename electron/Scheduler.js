const { ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');


class Scheduler {
    constructor(ensuredCompleteStart) {
        this.ensuredCompleteStart = async () => { await ensuredCompleteStart.call() }

        const remote = require('electron').remote;
        const { app } = require('electron');
        const savePath = (app || remote.app).getPath('userData');
        this.saveFile = path.join(savePath, 'saveSchedule.json');
        console.log("saveFile: " + this.saveFile);

        this.lastModified = new Date();
        this.schedule = '0 12 * * *';

        this.readSave();
        this.setupIPC();
        this.start();
    }

    // --------------------
    // IPC Handling
    // --------------------
    setupIPC() {
        ipcMain.on('SchedulerPageMounted', (event) => {
            console.log('IPC - SchedulerPageMounted');
            this.sendData(event, "SchedulerPageMounted");
        })
        ipcMain.on('SchedulerPageSave', (event, data) => {
            console.log('IPC - SchedulerPageSave', data);

            this.schedule = data;
            this.writeSave()
            this.start()
            this.sendData(event, "SchedulerPageMounted");
        })
    }

    // --------------------
    // Save Handling
    // --------------------

    readSave() {
        if (fs.existsSync(this.saveFile)) {
            const fileJson = JSON.parse(fs.readFileSync(this.saveFile));
            this.lastModified = path.normalize(fileJson.lastModified)
            this.schedule = path.normalize(fileJson.schedule)
        }
        else {
            console.error("[Scheduler] Could not read saveFile");
            this.writeSave();
        }
    }
    writeSave() {
        // write variables to file in json format
        this.lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString()

        const saveJson = JSON.stringify({
            lastModified: this.lastModified,
            schedule: this.schedule,
        }, null, 4);
        fs.writeFileSync(this.saveFile, saveJson, { encoding: 'utf-8' });
    }

    start() {
        this.job = schedule.scheduleJob(this.schedule, async () => this.ensuredCompleteStart())
    }
    cancel() {
        this.job.cancel();
    }

    sendData(event, channel) {
        const data = {
            lastModified: this.lastModified,
            schedule: this.schedule
        };
        event.reply(channel, data)
    }
}


module.exports = Scheduler