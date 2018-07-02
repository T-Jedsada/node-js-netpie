const MicroGear = require('microgear')

const KEY = '5y8ffXzWQQj5ih1'
const SECRET = '2aNnYbO9J0N8srOHsUC64KSIr'

var microgear = MicroGear.create({
    key: KEY,
    secret: SECRET
})

microgear.on('connected', function () {
    console.log('Connected...')
    microgear.setAlias("20scoopscnx-1234567890ABCD")
    setInterval(function () {
        microgear.chat('mygear', 'Hello world.')
    }, 1000)
})

microgear.on('/door/status', function (topic, body) {
    console.log('incoming : ' + topic + ' : ' + body)
})

microgear.on('closed', function () {
    console.log('Closed...')
})

module.exports = microgear