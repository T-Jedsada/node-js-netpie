const Hapi = require('hapi')
const netpie = require('./netpie')
require('./database').db
const Boom = require('boom')
const activityModel = require('./model/activity-model')

const server = Hapi.server({
    port: process.env.PORT || 8000
})

const doorCommandPostHandler = function (request, h) {
    const command = request.payload.command
    netpie.publish("/door", command, true)
    const reponse = {
        message: 'successfully'
    }

    return activityModel.find().then (function (err, activity) {
        console.log("error: " + err)
        return reponse
    }).catch(e => {
        return reponse
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