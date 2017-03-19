const fs = require('fs');
const request = require('request');

exports.savedContent = (file, doc) => {
  return new Promise( (resolve, reject) => {
    fs.writeFile(file, doc, function (err) {
      if (err) {
        reject('saveContent error' + err);
      } else {
        resolve('saveContent success')
      }
    })
  })
}

exports.readContent = (file) => {
  return new Promise( (resolve, reject) => {
    fs.readFile(file, function (err, data) {
        if (err) reject(err)
        else resolve(data)
    });
  })
}

exports.sleep = (ms) => {
  console.log( 'sleep', ms )
  return new Promise( (resolve, rejecet) => {
    setTimeout(resolve, ms)
  })
}

const x = 'https://www.baidu.com'
let req_header = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
  'Accept': 'text/html;q=0.9,*/*;q=0.8',
  'Accept-Charset': 'utf-8',
}

const options = {
  url: x, 
  encoding: null,
  headers: {
  }
};

exports.mrequest = (url, opt) => {
  options.url = url || x
  console.log('OOOOOOOOOOO', options)
  return new Promise( (resolve, reject) => {
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      } else {
        console.log( error )
        reject( error )
      }
    })
  })
}
