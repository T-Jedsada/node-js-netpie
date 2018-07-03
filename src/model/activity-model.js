const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const ActivitySchema = new Schema({
    urlImage: String,
    timestamp: String,
    action: String,
    serialNumber: String
})

module.exports = Mongoose.model('activities', ActivitySchema)