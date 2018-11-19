const Server = require('./server')


const server = new Server
server.start()

module.exports = new Promise((resolve, reject) => {
    //resolve('running server')
})
