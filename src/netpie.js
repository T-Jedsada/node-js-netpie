const MicroGear = require('microgear')

const KEY = '5y8ffXzWQQj5ih1'
const SECRET = '2aNnYbO9J0N8srOHsUC64KSIr'
const ALIAS = '20scoopscnx-1234567890ABCD'
const APPID = 'ihere'

var microgear = MicroGear.create({
    key: KEY,
    secret: SECRET,
    alias: ALIAS
})

microgear.on('connected', function () {
    microgear.subscribe("/door/status")
    console.log('Connected...')
})

microgear.on('closed', function () {
    console.log('Closed...')
})

microgear.connect(APPID)

module.exports = microgear