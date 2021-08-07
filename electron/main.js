require('./WindowHandler.js'); // Starts a Electron window to populate with React



const StorageHandler = require('./StorageHandler.js');
const storageHandler = new StorageHandler();

const ConfigHandler = require('./ConfigHandler.js');
const configHandler = new ConfigHandler(storageHandler.getScriptPath.bind(storageHandler));

const ScriptRunner = require('./ScriptRunner.js');
const scriptRunner = new ScriptRunner(storageHandler.getPlatformPath.bind(storageHandler), storageHandler.getScriptPath.bind(storageHandler), storageHandler.getBashPath.bind(storageHandler));

const Scheduler = require('./Scheduler.js');
//const scheduler = new Scheduler(scriptRunner.ensuredCompleteStart);
const scheduler = new Scheduler(scriptRunner.ensuredCompleteStart.bind(scriptRunner));



