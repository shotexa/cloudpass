const Net = require('net'),
    EventEmitter = require('events'),
    { serverPorts } = require('../config'),
    { debug, iterToGen } = require('../utils'),
    serverSocketFactory = require('./server-socket')



const log = debug(__dirname)


class Server extends EventEmitter {


    constructor() {
        super()
        this.server = new Net.Server()
        this.server.on('connection', this._onConnection.bind(this))
        this.server.on('error', this._onError.bind(this))
        this._availablePorts = iterToGen(serverPorts)

    }

    _onConnection(socket) {
        log('handling socket connection from %o', socket.address())
        const serverSocket = serverSocketFactory(socket)
        serverSocket.ready()
    }



    _onError(error) {
        this[`handle${error.code}`] ?
            this[`handle${error.code}`].call(this, error) :
            this._handleError(error)
    }

    _handleEADDRINUSE(error) {

    }

    _handleError(error) {

    }



    start() {
        log('listening on port %o', serverPorts)
        //TODO: check if port is in use

        this.server.listen(this._availablePorts.next().value)
    }

}

module.exports = function (...args) {
    return new Server(...args)
}