const serverFactory = require('./server')


const server = serverFactory()
server.start()

module.exports = new Promise((resolve, reject) => {
    //resolve('running server')
})
