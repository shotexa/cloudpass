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
        // if method in not present, call this method on socket
        get: function (target, name) {
            return function (...args) {
                target[name] ?
                    target.name.call(target, ...args)
                    : target.socket[name].call(target.socket, ...args)
            }
        }
    })
}
