const Net = require('net')
    , EventEmitter = require('events')
    , { serverPorts } = require('../config')
    , { debug } = require('../utils')


const log = debug(__dirname)


class ClientSocket extends EventEmitter {
    constructor() {
        super()

    }

    connect(ip) {
        if (!Net.isIP(ip.trim())) this.emit('INVALID_IP_ADDRESS')
    }
}


module.exports = function (...args) {
    return new ClientSocket(...args)
}