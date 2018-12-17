const Net = require('net')
  , EventEmitter = require('events')
  , { serverPorts } = require('../config')
  , { debug, iterToGen, remoteAddr } = require('../utils')
  , serverSocketFactory = require('./server-socket')



const log = debug(__dirname)


class Server extends EventEmitter {


  constructor() {
    super()
    this._server = new Net.Server
    this._server.on('connection', this._onConnection.bind(this))
    this._server.on('error', this._onError.bind(this))
    this._availablePorts = iterToGen(serverPorts)
    this._clients = new Map


  }

  close() {
    this._clients.forEach(sock => sock.end())
    this._server.close()
    this._clients.size === 0 && !this._server.listening && this.emit('CLOSE')
  }




  _onConnection(socket) {

    const addr = remoteAddr(socket)
    log('handling socket connection from %o', addr)
    const serverSocket = serverSocketFactory(socket)
    serverSocket.on('CLOSE', this._socketClosed.bind(this, serverSocket))
    this._clients.set(addr, serverSocket)
  }
  _socketClosed(serverSocket) {

    this._clients.delete(remoteAddr(serverSocket))
    this._clients.size === 0 && !this._server.listening && this.emit('CLOSE')
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
    this._server.listen(port)
  }

}

module.exports = function (...args) {
  return new Server(...args)
}
