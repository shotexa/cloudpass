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

  /**
   * @returns {void}
   * 
   * closes the server and emits close event for an application
   */
  close() {
    this._clients.forEach(sock => sock.end()) //send FIN package to every connected client
    this._server.close()
    // if all clients have disconnected and server stopped listening, lose the app
    this._clients.size === 0 && !this._server.listening && this.emit('CLOSE')
  }


  /**
   * @param {Net.Socket} socket 
   * @returns {void}
   * 
   * Triggers when client connects to a server
   */
  _onConnection(socket) {

    const addr = remoteAddr(socket)
    log('handling socket connection from %o', addr)
    const serverSocket = serverSocketFactory(socket) // Initialize server-socket instance
    serverSocket.on('CLOSE', this._socketClosed.bind(this, serverSocket)) // bind CLOSE event
    this._clients.set(addr, serverSocket) // add client to clients registry
    serverSocket.ready() // send SERVER_READY package
  }


  /** 
   * @param {ServerSocket} serverSocket 
   * @returns {void}
   * 
   * Triggers when one of the client sockets have closed
   */
  _socketClosed(serverSocket) {

    this._clients.delete(remoteAddr(serverSocket)) // Remove from clients entry
    // if all clients have disconnected and server stopped listening, lose the app
    this._clients.size === 0 && !this._server.listening && this.emit('CLOSE')
  }


  /**
   * @param {Error} error 
   * @returns {void}
   * 
   * delegates server error handling to dedicated handler based or error code
   */
  _onError(error) {

    this[`_handle${error.code}`] ?
      this[`_handle${error.code}`].call(this, error) :
      this._handleError(error)
  }

  /**
   * @param {Error} error 
   * @returns {void}
   * 
   * Handles EADDRINUSE error on server
   */
  _handleEADDRINUSE(error) {

    log('unable to start server')
    const tryAddr = this._availablePorts.next()
    log('attempting to start server on %o', tryAddr)
    // if non of available ports are free, close application with an error
    !tryAddr.done
      ? this.start(tryAddr.value)
      : this.emit('UNHANDLED_ERROR', new Error('All available ports are busy'))


  }

  /**
   * @param {Error} error 
   * @returns {void}
   * 
   * handles server error in case dedicated handler not found for specific error code
   */
  _handleError(error) {

    log('UNHANDLED ERROR %O', error)
    this.emit('UNHANDLED_ERROR', error)
  }


  /**
   * @param {Number | String<Number>} port 
   * @returns {void}
   * 
   * starts server
   */
  start(port) {
    port = port || this._availablePorts.next().value
    log('attempting to listen on %d', port)
    this._server.listen(port)
  }

}

module.exports = function (...args) {
  return new Server(...args)
}
