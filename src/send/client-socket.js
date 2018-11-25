const Net = require('net'),
    EventEmitter = require('events'),
    { serverPorts } = require('../config'),
    { debug } = require('../utils')


const log = debug(__dirname)


class ClientSocket extends EventEmitter {
    constructor() {
        super()

    }

    connect() {

    }
}


module.exports = function (...args) {
    return new ClientSocket(...args)
}