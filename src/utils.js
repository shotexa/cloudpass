const Readline = require('readline'),
    Debug = require('debug'),
    Config = require('./config')

const reader = Readline.createInterface(process.stdin, process.stdout)


const ask = ((r, q) => new Promise(resolve => r.question(q, ans => resolve(ans)))).bind(null, reader)
const noop = () => { }
const debug = scope => Config.env === 'dev' ? Debug(scope) : noop


module.exports = {
    ask,
    noop,
    debug
}