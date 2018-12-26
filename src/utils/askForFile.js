const fs = require('fs')
  , Readline = require('readline')
  , path = require('path')
  , { filter } = require('ramda')

const reader = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  completer: (line, cb) => {
    const realPath = path.resolve(line),
      searchIn = line.endsWith('/') ? realPath : path.dirname(realPath),
      matchStr = line.endsWith('/') ? realPath : path.basename(realPath),
      dataFn = line.endsWith('/') ? data => data : filter(x => x.startsWith(matchStr))

    fs.readdir(searchIn, (err, data) => cb(err, [dataFn(data), matchStr]))
  }
})


/**
 * @param {string} q question to display in terminal
 * @return {Promise<string>} file path
 * 
 * displays question
 */
const askForFile = ((r, q) => new Promise(resolve => r.question(q, ans => resolve(ans)))).bind(null, reader)

module.exports = askForFile
