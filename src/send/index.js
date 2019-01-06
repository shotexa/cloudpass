const clientSocketFactory = require('./client-socket')
  , fileFactory = require('../file')
  , { ask, debug, writeLine } = require('../utils')
  , askForFile = require('../utils/askForFile')

const log = debug(__dirname)

module.exports = new Promise((resolve, reject) => {
  const clientSocket = clientSocketFactory()
  clientSocket.on('UNHANDLED_ERROR', reject)
  clientSocket.on('CONNECTION', writeLine.bind(null, 'Connection established...'))
  clientSocket.on('SERVER_READY', () => {
    // Kickoff file sending process once server sends SERVER_READY package
    askForFile('Please enter the file name > ')
      .then(fileFactory)
      .then(file => {

      })
  })
  const connect = clientSocket.connect.bind(clientSocket)
  clientSocket.on('INVALID_IP_ADDRESS', () => {
    // Ask for ip address until it's in valid format
    ask('Ip address you\'ve entered is invalid, try again ').then(connect)
  })
  ask('Enter the IP address of the receiver computer ').then(connect)

  clientSocket.on('CLOSE', resolve)

  // send FIN package if process is terminated to notify server that socket is not available on this end
  process.on('SIGINT', clientSocket.end.bind(clientSocket))
  process.on('SIGTERM', clientSocket.end.bind(clientSocket))
  process.on('SIGQUIT', clientSocket.end.bind(clientSocket))
  process.on('SIGHUP', clientSocket.end.bind(clientSocket))
  process.on('SIGBREAK', clientSocket.end.bind(clientSocket))

})
