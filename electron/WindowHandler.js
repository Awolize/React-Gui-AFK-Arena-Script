const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'build' });
var config = require('../config.json');

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
let iconPath = isDev() ? path.join(process.cwd(), 'public/icon.ico') : path.join(__dirname, 'public/icon.ico')

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