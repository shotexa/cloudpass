const { oct } = require('./utils')
// 1 bit codes for each operation
module.exports = {
  SERVER_READY: oct(0xA),
  SPACE_OK: oct(0x14),
  SPACE_NOT_OK: oct(0x1E),
  OFFER_SEND_MORE_FILES: oct(0x28)
}
