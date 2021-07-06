const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs')
const serve = require('electron-serve');
const loadURL = serve({ directory: 'build' });
var config = require('./config.json');

function isDev() {
    return !app.isPackaged;
}

require('@electron/remote/main').initialize()
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let mainWindow;
let tray = null;
let iconPath = isDev() ? path.join(process.cwd(), 'public/icon.ico') : path.join(__dirname, 'build/icon.ico')

function createTray() {
    tray = new Tray(iconPath)

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                mainWindow.show()
            }, type: 'normal'
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit()
            }, type: 'normal'
        }
    ])

    tray.on('click', function (e) {
        mainWindow.show()
    });

    tray.setContextMenu(contextMenu)
    tray.setToolTip('AFK Helper')
}

function clearTray() {
    if (tray)
        tray.destroy()
    tray = null
}

const createMainWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 925, //(config.debug ? 200 : 0)
        height: 1000,
        frame: true,
        icon: iconPath,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: true
    });


    // This block of code is intended for development purpose only.
    // Delete this entire block of code when you are ready to package the application.
    if (isDev()) {
        mainWindow.loadURL('http://localhost:3000/');
    } else {
        loadURL(mainWindow);
    }

    // Open the DevTools and also disable Electron Security Warning.
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

    // Open the DevTools.
    if (config.debug) {
        devtools = new BrowserWindow()
        mainWindow.webContents.setDevToolsWebContents(devtools.webContents)
        mainWindow.webContents.openDevTools({ mode: 'detach' })
    }

    mainWindow.setMenuBarVisibility(false)

    // and load the index.html of the app.
    //mainWindow.loadFile(path.join(__dirname, '/main/index.html'));

    mainWindow.on('closed', function (event) {
        clearTray()
        app.quit();
    })

    mainWindow.on('show', function (event) {
        clearTray()
    })

    mainWindow.on('minimize', function (event) {
        event.preventDefault()
        mainWindow.hide()
        createTray()
    })

    // Emitted when the window is ready to be shown
    // This helps in showing the window gracefully.
    // mainWindow.once('ready-to-show', () => {
    //     mainWindow.show()
    // });

    return mainWindow;
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    mainWindow = createMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});




const { ipcMain } = require('electron')
const childProcess = require("child_process");


var lastModified = new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString()
var noxPath = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe')
var scriptPath = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script/deploy.sh')
var bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe')

const electron = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const savePath = path.join(userDataPath, 'save.json');

console.log(savePath);

ipcMain.on('readStorage', (event) => {
    console.log('readStorage');
    try {
        const fileJson = JSON.parse(fs.readFileSync(savePath));
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
        resetPaths();
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

    this.setState({ lastModified: new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString() })
    const settings = {
        lastModified: lastModified,
        nox: noxPath,
        script: scriptPath,
        bash: bashPath
    };

    fs.writeFileSync(savePath, JSON.stringify(settings, null, 4), 'utf-8');
    event.reply("newData", JSON.stringify(settings, null, 4))
})


ipcMain.on('resetStorage', (event) => {
    console.log("resetStorage");
    try {
        resetPaths();

        this.setState({ lastModified: new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString() })
        const settings = {
            lastModified: lastModified,
            nox: noxPath,
            script: scriptPath,
            bash: bashPath
        };

        fs.writeFileSync(savePath, JSON.stringify(settings, null, 4), 'utf-8');
        console.log('Save file has been reset: ' + savePath);
        event.reply("newData", JSON.stringify(settings, null, 4))
    }
    catch (e) {
        console.log('Failed saving to file:' + e);
    }
})

function resetPaths() {
    noxPath = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe')
    scriptPath = path.normalize('C:/Users/alexs/Desktop/AFK-Daily-master/AFK-Arena-Script/deploy.sh')
    bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe')
}


// -- Config --

ipcMain.on('readConfig', (event) => {
    console.log('readConfig');
    try {
        let configPath = path.dirname(scriptPath) + "/config.sh"
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
        console.error("Couldnt read Config file: " + err);
    }
})

ipcMain.on('writeConfig', (event, data) => {
    console.log('writeConfig');
    try {
        let configPath = path.dirname(scriptPath) + "/config.sh"
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
    console.log(noxPath);
    noxPath = noxPath.replaceAll('\\', '/');
    run_script(jobList.length, event, replayChannel, `"${noxPath}"`)
}

function startScript(event = null, replayChannel = "") {
    let scriptDir = path.dirname(scriptPath).replaceAll('\\', '/')
    let scriptName = path.basename(scriptPath).replaceAll('\\', '/')
    let args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -n"`]
    //"C:\Program Files\Git\bin\sh.exe" - c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

    run_script(jobList.length, event, replayChannel, `"${bashPath.replaceAll('\\', '/')}"`, args)
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
