const { oct } = require('./utils')

module.exports = {
    SERVER_READY: oct(0x01),
    SPACE_OK: oct(0x02),
    SPACE_NOT_OK: oct(0x03),
    OFFER_SEND_MORE_FILES: oct(0x04)
}