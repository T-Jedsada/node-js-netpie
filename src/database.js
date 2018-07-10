const mongoose = require('mongoose');

var uri = 'mongodb://ihere_admin:ihereadmin20@ds231501.mlab.com:31501/i-here-database'
mongoose.connect(uri, {useNewUrlParser: true}).then(() => {
    console.log("connected database successfully...")
})