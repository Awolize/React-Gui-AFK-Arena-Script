const path = require('path');
const { ipcMain } = require('electron')
const childProcess = require("child_process");
const schedule = require('node-schedule');

const jobList = [""]
var clientOutput;

class ScriptRunner {
    constructor(getPlatformPath, getScriptPath, getBashPath) {
        this.getPlatformPath = () => { return getPlatformPath.call() }
        this.getScriptPath = () => { return getScriptPath.call() }
        this.getBashPath = () => { return getBashPath.call() }

        this.setupIPC()
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async ensuredCompleteStart() {
        let jobIndex = jobList.length;
        this.clearScriptOutput(jobIndex)
        this.startPlatform()
        await this.sleep(20000)
        this.startScript()
        await this.sleep(10000)

        /*while (this.errorInScriptOutput(jobIndex)) {
            this.clearScriptOutput(jobIndex)
            this.startScript()
            await this.sleep(10000)
        }*/
    }


    errorInScriptOutput(i) {
        let text = jobList[i];
        let n = text.includes("Error");

        if (n) {
            this.clearScriptOutput(jobIndex)
            return true
        }
        return false
    }

    clearScriptOutput(index) {
        jobList[index] = "";
    }

    setupIPC() {
        ipcMain.on('Mounted', (event) => {
            clientOutput = event;
            console.log("ScriptRunner Mounted");
            if (jobList[jobList.length - 1])
                event.reply("Mounted", jobList[jobList.length - 1])
        })
        ipcMain.on('Unmounted', (event) => {
            clientOutput = null;
            console.log("ScriptRunner Unmounted");
        })

        ipcMain.on('startPlatform', (event, replayChannel) => this.startPlatform(event, replayChannel))
        ipcMain.on('startScript', (event, replayChannel) => this.startScript(event, replayChannel))
    }

    run_script(jobIndex = jobList.length, event = null, replyChannel, command, args) {

        const child = childProcess.spawn(command, args, {
            encoding: "utf8",
            shell: true
        });

        console.log(`Subprocess spawned with Command: ${command}, args: ${args}`);
        jobList[jobIndex] = `Command: ${command}, args: ${args}\n`

        child.on("error", (error) => {
            console.log(error);

            error = error.toString();
            jobList[jobIndex] += error // save on server

            if (clientOutput) {
                clientOutput.reply("replay-script", error) // send to client
            }
            else if (event) {
                event.reply(replyChannel, error) // send to client
            }
        });

        child.stdout.on("data", (data) => {

            //Here is the output
            data = data.toString();
            console.log(data.trim());
            jobList[jobIndex] += data // save on server

            if (clientOutput) {
                clientOutput.reply("replay-script", data) // send to client
            }
            else if (event) {
                event.reply(replyChannel, data) // send to client
            }

        });

        child.stderr.on("data", (data) => {
            //Here is the output from the command
            data = data.toString();
            console.log(data.trim());
            jobList[jobIndex] += data // save on server

            if (clientOutput) {
                clientOutput.reply("replay-script", data) // send to client
            }
            else if (event) {
                event.reply(replyChannel, data) // send to client
            }
        });

        child.on("close", (code) => {
            console.log("Process ended:" + code);
            code = code + ""

            if (clientOutput) {
                clientOutput.reply("replay-script-status", code) // send to client
            }
            else if (event) {
                event.reply("replay-script-status", code) // send to client
            }
        });
    }

    startPlatform(event = null, replayChannel = "") {
        console.log(this.getPlatformPath());
        let platformPath = this.getPlatformPath().replaceAll('\\', '/');
        this.run_script(jobList.length, event, replayChannel, `"${platformPath}"`, ["--instance Nougat32"])
    }

    startScript(event = null, replayChannel = "") {
        let scriptDir = path.dirname(this.getScriptPath()).replaceAll('\\', '/')
        let scriptName = path.basename(this.getScriptPath()).replaceAll('\\', '/')
        let args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -bs"`]
        //"C:\Program Files\Git\bin\sh.exe" - c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

        this.run_script(jobList.length, event, replayChannel, `"${this.getBashPath().replaceAll('\\', '/')}"`, args)
    }
}


module.exports = ScriptRunner


