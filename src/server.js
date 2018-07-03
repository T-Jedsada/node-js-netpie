const Hapi = require('hapi')
const netpie = require('./netpie')
require('./database')
const Boom = require('boom')
const ActivityModel = require('./model/activity-model')

const server = Hapi.server({
    port: process.env.PORT || 8000
})

const doorCommandPostHandler = function (request, h) {
    const command = request.payload.command
    netpie.publish("/door", command, true)

    var activity = new ActivityModel()
    activity.timestamp = "test"
    activity.urlImage = "test"
    activity.action = "test"
    activity.serialNumber = "test"

    console.log(JSON.stringify(activity))
    activity.save((err) => {
        h.reponse("test")
    })
}

server.route({
    method: 'POST',
    path: '/door/command',
    handler: doorCommandPostHandler
})

async function start() {
    try {
        await server.start()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
    console.log('Server running at:', server.info.uri)
}

start()