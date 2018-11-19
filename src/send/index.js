const Net = require('net')

const socket = new Net.Socket(null, false, true, true)
socket.connect('9000', '10.0.0.2', () => {
    socket.write('testing connection')
    socket.end()

})
module.exports = new Promise((resolve, reject) => {
    //resolve('sending to server')
})
