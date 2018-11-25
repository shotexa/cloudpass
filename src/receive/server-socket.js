const { debug } = require('../utils')
    , Proto = require('../protocol')




const log = debug(__dirname)

class ServerSocket {
    constructor(socket) {
        this.socket = socket
        this.socket.on('data', this._onData.bind(this))
    }

    _onData(chunk) {

    }

    ready() {
        log('sending SERVER_READY packet to %o', this.socket.address())
        this.socket.write(Proto.SERVER_READY)
    }

}

module.exports = function (...args) {
    return new Proxy(new ServerSocket(...args), {
        // if method or property in not present on ServerSocket instance, use internal socket object
        get: function (target, name) {
            const host = target[name] ? target : target.socket[name] ? target.socket : null
            const prop = target[name] || target.socket[name] || undefined
            return typeof prop === 'function' ? prop.bind(host) : prop
        }
    })
}
