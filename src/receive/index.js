const serverFactory = require('./server')



module.exports = new Promise((resolve, reject) => {
    const server = serverFactory()
    server.on('UNHANDLED_ERROR', error => reject(error))
    server.start()
})
