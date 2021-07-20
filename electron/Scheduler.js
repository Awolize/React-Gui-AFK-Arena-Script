


class Scheduler {
    constructor(ensuredCompleteStart) {
        this.ensuredCompleteStart = async () => { await ensuredCompleteStart.call() }


        const schedule = require('node-schedule');
        const job = schedule.scheduleJob('0 6 * * *', async () => this.ensuredCompleteStart()); // How often script should run. cronjob style

    }
}


module.exports = Scheduler