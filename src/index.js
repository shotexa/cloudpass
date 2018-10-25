const Readline = require('readline'),
    Promise = require('bluebird'),
    { join } = require('path')



const reader = Readline.createInterface(process.stdin, process.stdout),
    checkAns = (ans) => [...'sr'].indexOf(ans.toLowerCase()) > -1,
    ask = (r, q) => new Promise((resolve) => r.question(q, (ans) => resolve(ans)))


ask(reader, 'Do you want to send or receive files? [S/R] ')
    .then(function (ans) {
        return !checkAns(ans) ? ask(reader, 'Please enter "S" for send and "R" for receive [S/R] ').then(arguments.callee) : ans
    })
    .then((ans) => ans.toLowerCase())
    .then((ans) => ({ r: 'receive', s: 'send' }[ans]))
    .then((action) => require(join(__dirname, action)))
    .then((res) => console.log(res)) // TODO: implement send and receive functionality
    .then(process.exit.bind(process, 0))

