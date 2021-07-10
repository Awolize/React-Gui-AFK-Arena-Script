require('./WindowHandler.js')

const path = require('path');
const { ipcMain } = require('electron')
const childProcess = require("child_process");

const StorageHandler = require('./StorageHandler.js')
const storageHandler = new StorageHandler()

console.log("scriptPath: ", storageHandler.getScriptPath());

const ConfigHandler = require('./ConfigHandler.js')
const configHandler = new ConfigHandler(storageHandler.getScriptPath)


// ------ HANDLE SCRIPT ---------------
// ------ HANDLE SCRIPT ---------------
// ------ HANDLE SCRIPT ---------------

const jobList = [""]


var clientOutput;
ipcMain.on('Mounted', (event) => {
    clientOutput = event;
    console.log("Mounted");
    if (jobList[jobList.length - 1])
        event.reply("Mounted", jobList[jobList.length - 1])
})
ipcMain.on('Unmounted', (event) => {
    clientOutput = null;
    console.log("Unmounted");
})

ipcMain.on('startNox', (event, replayChannel) => startNox(event, replayChannel))
ipcMain.on('startScript', (event, replayChannel) => startScript(event, replayChannel))

function startNox(event = null, replayChannel = "") {
    console.log(storageHandler.noxPath);
    let noxPath = storageHandler.noxPath.replaceAll('\\', '/');
    run_script(jobList.length, event, replayChannel, `"${noxPath}"`)
}

function startScript(event = null, replayChannel = "") {
    let scriptDir = path.dirname(storageHandler.scriptPath).replaceAll('\\', '/')
    let scriptName = path.basename(storageHandler.scriptPath).replaceAll('\\', '/')
    let args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -n"`]
    //"C:\Program Files\Git\bin\sh.exe" - c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

    run_script(jobList.length, event, replayChannel, `"${storageHandler.bashPath.replaceAll('\\', '/')}"`, args)
}

function run_script(jobIndex = jobList.length, event = null, replyChannel, command, args) {

    const child = childProcess.spawn(command, args, {
        encoding: "utf8",
        shell: true
    });

    console.log(`Subprocess spawned with Command: ${command}, args: ${args}`);
    jobList[jobIndex] = `Command: ${command}, args: ${args}\n`

    child.on("error", (error) => {
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


// ------ HANDLE SCRIPT ---------------
// ------ HANDLE SCRIPT ---------------
// ------ HANDLE SCRIPT ---------------

function sleep(ms) { // helper
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Run every day at 06.00
const schedule = require('node-schedule');
const job = schedule.scheduleJob('0 6 * * *', async () => dailySchedule()); // How often script should run. cronjob style
//const job = schedule.scheduleJob('*/1 * * * *', async () => dailySchedule()); // How often script should run. cronjob style

function clearScriptOutput(index) {
    jobList[index] = "";
}

async function dailySchedule() {
    let jobIndex = jobList.length;
    clearScriptOutput(jobIndex)
    startNox()
    await sleep(20000)
    startScript()
    await sleep(10000)

    while (errorInScriptOutput(jobIndex)) {
        clearScriptOutput(jobIndex)
        startScript()
        await sleep(10000)
    }
}

function errorInScriptOutput(i) {
    let text = jobList[i]
    let n = text.includes("Error");

    if (n) {
        clearScriptOutput(jobIndex)
        return true
    }
    return false
}
