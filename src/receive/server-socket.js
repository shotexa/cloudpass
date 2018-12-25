const { debug, remoteAddr } = require('../utils')
  , Proto = require('../protocol')
  , EventEmitter = require('events')




const log = debug(__dirname)

class ServerSocket extends EventEmitter {
  constructor(socket) {
    super()
    this._socket = socket
    this._socket.on('close', this._onClose.bind(this))
    this._socket.on('end', this._onEnd.bind(this))
    this._socket.on('data', this._onData.bind(this))
  }

  _onClose() {
    log('closing server socket')
    this.emit('CLOSE')
  }
  _onEnd() {
    log('ending server socket')
  }

  _onData(chunk) {

  }


  ready() {
    log('sending SERVER_READY packet to %o', remoteAddr(this._socket))
    this._socket.write(Proto.SERVER_READY)
  }

}

module.exports = function (...args) {
  return new Proxy(new ServerSocket(...args), {
    // if method or property in not present on ServerSocket instance, use internal socket object
    get: function (target, name) {
      const host = target[name] ? target : target._socket[name] ? target._socket : null
      const prop = target[name] || target._socket[name] || undefined

      return typeof prop === 'function' ? prop.bind(host) : prop
    }
  })
}
