/**
 * send signal to all running servers (default SIGKILL)
 */

const { exec } = require('child_process')
    , { serverPorts } = require('../src/config')

const signal = process.argv[2] && !isNaN(Number(process.argv[2])) ? process.argv[2] : 9

serverPorts.map(p => new Promise((resolve, reject) => {
    exec(`kill -${signal} $(lsof -t -i:${p})`, (error, stdout, stderr) => { // sends signal 7 to process
        if (error) reject(error)
        else resolve({ p, stdout, stderr })
    })
})).forEach(promise => promise.then(({ p, stdout, stderr }) => {
    console.info(`response on killing ${p}`)
    console.info(`STDOUT: ${stdout}`)
    console.info(`STDERR: ${stderr}`)
}).catch(err => {
    console.error('Error trying to kill process %O', err) // this error will be thrown also if process is not running in a first place, so no worries
}))


