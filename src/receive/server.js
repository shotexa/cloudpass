const Net = require('net')
    , EventEmitter = require('events')
    , { serverPorts } = require('../config')
    , { debug, iterToGen } = require('../utils')
    , serverSocketFactory = require('./server-socket')



const log = debug(__dirname)


class Server extends EventEmitter {


    constructor() {
        super()
        this.server = new Net.Server()
        this.server.on('connection', this._onConnection.bind(this))
        this.server.on('error', this._onError.bind(this))
        this._availablePorts = iterToGen(serverPorts)
        this._clients = new Map


    }

    _onConnection(socket) {
        const addr = socket.address()
        log('handling socket connection from %o', addr)
        const serverSocket = serverSocketFactory(socket)
        this._clients.set(addr, serverSocket)
        serverSocket.ready()

    }



    _onError(error) {
        this[`_handle${error.code}`] ?
            this[`_handle${error.code}`].call(this, error) :
            this._handleError(error)
    }

    _handleEADDRINUSE(error) {
        log('unable to start server')
        const tryAddr = this._availablePorts.next()
        log('attempting to start server on %o', tryAddr)
        !tryAddr.done
            ? this.start(tryAddr.value)
            : this.emit('UNHANDLED_ERROR', new Error('All available ports are busy'))


    }

    _handleError(error) {
        log('UNHANDLED ERROR %O', error)
        this.emit('UNHANDLED_ERROR', error)
    }



    start(port) {
        port = port || this._availablePorts.next().value
        log('attempting to listen on %d', port)
        this.server.listen(port)
    }

}

module.exports = function (...args) {
    return new Server(...args)
}