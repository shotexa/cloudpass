const Net = require('net'),
    { EventEmitter } = require('events'),
    { serverPort } = require('../config'),
    { debug } = require('../utils')



const log = debug(__dirname)


module.exports = class Server extends EventEmitter {

    constructor() {
        super()
        this.server = new Net.Server()
        this.server.on('connection', this._handleConnection.bind(this))
        this.server.on('error', this._handleError.bind(this))

    }

    _handleConnection(socket) {
        log('handling socket connection from %o', socket.address())

    }

    _handleError(error) {
        log(error)
    }



    start() {
        log('listening on port %d', serverPort)

        this.server.listen(serverPort)
    }

}