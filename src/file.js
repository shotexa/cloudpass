const fs = require('fs')
  , { debug } = require('./utils')

const log = debug(__dirname)

class File {

  constructor(path) {

  }


  info() {

  }


  isLegitimate() {

  }

  content(encoding = 'utf8') {

  }

}

module.exports = function (...args) {
  return new File(...args)
}
