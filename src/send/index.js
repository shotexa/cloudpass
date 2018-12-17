const clientSocketFactory = require('./client-socket')
  , { ask, debug, writeLine } = require('../utils')

const log = debug(__dirname)


module.exports = new Promise((resolve, reject) => {
  const clientSocket = clientSocketFactory()
  clientSocket.on('UNHANDLED_ERROR', error => reject(error))
  clientSocket.on('CONNECTION', writeLine.bind(null, 'Connection established...'))
  clientSocket.on('INVALID_IP_ADDRESS', () => {
    ask('Ip address you\'ve entered is invalid, try again ').then(ip => clientSocket.connect(ip))
  })
  ask('Enter the IP address of the receiver computer ').then(ip => clientSocket.connect(ip))

  clientSocket.on('CLOSE', resolve)

  process.on('SIGINT', clientSocket.end.bind(clientSocket))
  process.on('SIGTERM', clientSocket.end.bind(clientSocket))
  process.on('SIGQUIT', clientSocket.end.bind(clientSocket))
  process.on('SIGHUP', clientSocket.end.bind(clientSocket))
  process.on('SIGBREAK', clientSocket.end.bind(clientSocket))

})
