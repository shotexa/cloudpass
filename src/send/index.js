const clientSocketFactory = require('./client-socket')

const clientSocket = clientSocketFactory()

clientSocket.connect()


module.exports = new Promise((resolve, reject) => {
    //resolve('sending to server')
})
