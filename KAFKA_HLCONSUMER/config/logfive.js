
var log4js = require('log4js'); // include log4js
var appRoot = require('app-root-path');
log4js.configure({
  appenders: {
	  console: { type: 'console' },
    everything: { type: 'file', filename: `${appRoot}/logs/full.log`, maxLogSize: 10485760, backups: 3, compress: true },
    emergencies: { type: 'file', filename: `${appRoot}/logs/panic.log`,  maxLogSize: 10485760, backups: 3, compress: true},
    justerrors: { type: 'logLevelFilter', appender: 'emergencies', level: 'error' }
  },
  categories: {
    default: { appenders: ['justerrors', 'everything','console' ], level: 'debug' }
  },
	pm2: true,
       disableClustering: true
});
//const logger = log4js.getLogger('cheese');
const logger = log4js.getLogger('PROCESS_KAFKA');
module.exports = logger
