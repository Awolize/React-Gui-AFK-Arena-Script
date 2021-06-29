const path = require('path');
const fs = require('fs')

// Run every day at 06.00
const schedule = require('node-schedule');
const job = schedule.scheduleJob('0 6 * * *', async () => dailySchedule()); // How often script should run. cronjob style

async function dailySchedule() {
    clearScriptOutput()
    startNox()
    await sleep(20000)
    startScript()
    await sleep(10000)

    while (errorInScriptOutput()) {
        clearScriptOutput()
        startScript()
        await sleep(10000)
    }
}

function errorInScriptOutput() {
    let text = getCommandOutput().innerHTML
    let n = text.includes("Error");

    if (n) {
        clearScriptOutput
        return true
    }
    return false
}