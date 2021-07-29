require('./WindowHandler.js'); // Starts a Electron window to populate with React



const StorageHandler = require('./StorageHandler.js');
const storageHandler = new StorageHandler();
console.log("scriptPath: ", storageHandler.getScriptPath());

const ConfigHandler = require('./ConfigHandler.js');
const configHandler = new ConfigHandler(storageHandler.getScriptPath);

const ScriptRunner = require('./ScriptRunner.js');
const scriptRunner = new ScriptRunner(storageHandler.getPlatformPath, storageHandler.getScriptPath, storageHandler.getBashPath);

const Scheduler = require('./Scheduler.js');
const scheduler = new Scheduler(scriptRunner.ensuredCompleteStart);


