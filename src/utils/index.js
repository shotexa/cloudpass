const Readline = require('readline')
  , Debug = require('debug')
  , Config = require('../config')

const reader = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

/**
 * @param {string} q question to display in terminal
 * @return {Promise<string>} answer on the question 'q'
 * 
 * displays question
 */
const ask = ((r, q) => new Promise(resolve => r.question(q, ans => resolve(ans)))).bind(null, reader)



/**
 * no operation
 */
const noop = () => { }

/**
 * @param {string} scope scope on which debug operates on
 * @return {Function}
 * 
 * returns debugger on specific scope if process is in dev environment
 */
const debug = scope => Config.env === 'dev' ? Debug(scope) : noop

/**
 * @param  {...number} numbers 
 * @return {Buffer} buffer from given numbers
 * 
 * returns list of bytes from given numbers
 */
const oct = (...numbers) => Buffer.from([...numbers])

/**
 * @param {Iterable} iterable 
 * @returns {Generator}
 * 
 * returns generator that yields iterable values one by one
 */
const iterToGen = iterable => (function* () {
  for (const v of iterable) yield v
}())

/**
 * @param {string} data data to display
 * @returns {void}
 * 
 * displays line 
 */
const writeLine = data => reader.write(data + '\n')

/**
 * @param {Socket} socket instance of net.socket instance
 * @returns {object} address 
 * 
 * returns remote ip, port and family of the socket
 */
const remoteAddr = socket => ({ address: socket.remoteAddress, family: socket.remoteFamily, port: socket.remotePort })



module.exports = {
  ask,
  noop,
  debug,
  oct,
  iterToGen,
  writeLine,
  remoteAddr
}
