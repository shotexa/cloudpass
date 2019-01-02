const serverFactory = require('./server')



module.exports = new Promise((resolve, reject) => {
  const server = serverFactory()
  server.on('UNHANDLED_ERROR', reject)
  server.on('CLOSE', resolve)

  // Close server in case process is interrupted or terminated 
  process.on('SIGINT', server.close.bind(server))
  process.on('SIGTERM', server.close.bind(server))
  process.on('SIGQUIT', server.close.bind(server))
  process.on('SIGHUP', server.close.bind(server))
  process.on('SIGBREAK', server.close.bind(server))

  server.start()

})
