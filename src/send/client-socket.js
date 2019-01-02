const Net = require('net')
  , EventEmitter = require('events')
  , { serverPorts } = require('../config')
  , { debug, iterToGen, remoteAddr } = require('../utils')
  , Proto = require('../protocol')


const log = debug(__dirname)


class ClientSocket extends EventEmitter {
  constructor() {
    super()
    this._socket = new Net.Socket(null, false, true, true)
    this._socket.on('connect', this._onConnect.bind(this))
    this._socket.on('error', this._onError.bind(this))
    this._socket.on('data', this._onData.bind(this))
    this._socket.on('end', this._onEnd.bind(this))
    this._socket.on('close', this._onClose.bind(this))
    this._availablePorts = iterToGen(serverPorts)
  }

  /**
   * 
   * @param {Buffer} chunk 1 byte length buffer
   * @returns {void}
   * 
   * Triggers dedicated events when data is received
   */
  _onData(chunk) {
    const res = this._parseResponse(chunk)
    if (res) this.emit(res)
    else {
      log('unknown response', res)
      this.emit('UNHANDLED_ERROR', new Error('unknown response from server'))
    }
  }

  /**
   * @returns {void}
   * 
   * triggered when socket is ended (received FIN package )
   */
  _onEnd() {
    this._socket.ended = true
    log('ending client socket')
  }

  /**
   * @returns {void}
   * 
   * triggered when socket is closed
   */
  _onClose() {
    log('closing client socket')
    this._socket.ended && this.emit('CLOSE') // emit close only if socket of closed via TCP termination process
  }

  /**
   * @returns {void}
   * 
   * triggered when connection to server is established
   */
  _onConnect() {
    this.emit('CONNECTION')
    log('connection established to %o', remoteAddr(this._socket))
  }

  /**
   * 
   * @param {Error} error 
   * @returns {void}
   * 
   * handles socket error in case dedicated handler not found for specific error code
   */
  _handleError(error) {
    log('UNHANDLED ERROR %O', error)
    this.emit('UNHANDLED_ERROR', error)
  }

  /**
   * 
   * @param {Error} error 
   * @returns {void}
   * 
   * delegates socket error handling to dedicated handler based or error code
   */
  _onError(error) {
    this[`_handle${error.code}`] ?
      this[`_handle${error.code}`].call(this, error) :
      this._handleError(error)
  }

  /**
   * 
   * @param {Error} error
   * @returns {void} 
   * 
   * handles ECONNREFUSED error for socket
   */
  _handleECONNREFUSED(error) {
    log('unable to connect to %s:%s', error.address, error.port)
    const tryAddr = this._availablePorts.next()
    log('trying new port %s', tryAddr.value)
    !tryAddr.done
      ? this.connect(error.address, tryAddr.value)
      : this.emit('UNHANDLED_ERROR', new Error(`Non of the available ports are listening on ${error.address}`))

  }

  /**
   * 
   * @param {Buffer} buffer 
   * @returns corresponding protocol name string representation 
   */
  _parseResponse(buffer) {
    const entry = Object.entries(Proto).find(entry => entry[1].equals(buffer))
    return !!entry && entry[0]
  }

  /**
   * 
   * @param {String} ip 
   * @param {Number | String<Number>} port 
   * 
   * @returns {void}
   * 
   * initializes socket connection to server
   */
  connect(ip, port) {

    // if port is not provided, get next free port from list of predefined ports  
    port = port || this._availablePorts.next().value
    ip = ip.trim()
    if (!Net.isIP(ip)) {
      // if IP is invalid, emit corresponding event
      this.emit('INVALID_IP_ADDRESS')
      return
    }
    this._socket.connect(port, ip)

  }

  kickOff(path) {
    log(path)
  }
}

module.exports = function (...args) {
  return new Proxy(new ClientSocket(...args), {
    // if method or property in not present on ClientSocket instance, use internal socket object
    get: function (target, name) {
      const host = target[name] ? target : target._socket[name] ? target._socket : null
      const prop = target[name] || target._socket[name] || undefined

      return typeof prop === 'function' ? prop.bind(host) : prop
    }
  })
}

