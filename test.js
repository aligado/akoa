const DB = require('./models').DB

if (!module.parent) {
  //console.log(DB.models)
  for (let i in DB.models) {
    console.log(i)
    //console.log(DB.models[i])
    DB.models[i].find({}).exec()
      .then( docs => {
        console.log(docs)
      })
  }
  //DB.disconnect()
}