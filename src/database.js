const mongoose = require('mongoose');

var uri = 'mongodb://20scoops:20scoops@ds121871.mlab.com:21871/ihere-db';
const db = mongoose.createConnection(uri);

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Connection with database succeeded.');
});

exports.db = db;