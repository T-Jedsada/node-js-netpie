const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const SerialNumberSchema = new Schema({
    serialNumber: {
        type: String,
        index: true,
        maxlength: 20,
        trim: true
    },
    timestamp: String,
})

module.exports = Mongoose.model('serialnumbers', SerialNumberSchema)