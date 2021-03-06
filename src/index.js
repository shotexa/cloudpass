global.Promise = require('bluebird')
const { join } = require('path')
  , { ask, debug } = require('./utils')


const log = debug(__dirname)

// Kickoff with initial question
ask('Do you want to send or receive files? [S/R] ')
  .then(function (ans) {
    // if answer format is incorrect, ask until correct answer is given, then proceed
    return [...'sr'].indexOf(ans.toLowerCase()) === -1 ? ask('Please enter "S" for send and "R" for receive [S/R] ').then(arguments.callee) : ans
  })
  .then(ans => ans.toLowerCase())
  .then(ans => ({ r: 'receive', s: 'send' }[ans]))
  .then(action => require(join(__dirname, action))) // start either client or server
  .then(res => log(res))
  .then(() => {
    log('successfully exited')
    process.exit(0)
  })
  .catch(err => (log(err), process.exit(1)))
