var mongoose = require('mongoose')
var Schema = mongoose.Schema

const USERS_SCHEMA = new Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("users2", USERS_SCHEMA)