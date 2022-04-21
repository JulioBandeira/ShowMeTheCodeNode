var CronJob = require('cron').CronJob;

module.exports = (app)=> {

    new CronJob('* * * * *', function() {
    
        console.log('Hello puppies! ', Date())
        // International
       
    }, null, true, 'America/Los_Angeles');

}