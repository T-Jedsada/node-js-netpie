const mongoose = require('mongoose');

var uri = 'mongodb://20scoops:20scoops@ds121871.mlab.com:21871/ihere-db'
mongoose.connect(uri, {useNewUrlParser: true}).then(() => {
    console.log("connected database successfully...")
})