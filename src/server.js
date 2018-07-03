const Hapi = require('hapi')
const netpie = require('./netpie')
require('./database')
const Boom = require('boom')
const ActivityModel = require('./model/activity-model')

const server = Hapi.server({
    port: process.env.PORT || 4000
})

const doorCommandPostHandler = function (request, h) {
    const command = request.payload.command
    netpie.publish("/door", command, true)
    return {
        message: "successfully"
    }
}

const saveActivity = (request, h) => {
    var activity = new ActivityModel()
    activity.timestamp = request.payload.timestamp
    activity.urlImage = request.payload.urlImage
    activity.action = request.payload.action
    activity.serialNumber = request.payload.serialNumber
    return activity.save().then(() => {
        return {
            message: "success create"
        }
    }).catch(err => {
        Boom.badImplementation('something went wrong while saving activitie .')
    })
}

const getActivities = (request, h) => {
    return ActivityModel.find({}).then(data => {
        return data
    }).catch(err => {
        Boom.badImplementation('something went wrong while query activitie .')
    })
}

server.route([{
        method: 'GET',
        path: '/activities',
        handler: getActivities
    },
    {
        method: 'POST',
        path: '/activities',
        handler: saveActivity
    },
])

server.route([{
    method: 'POST',
    path: '/door/command',
    handler: doorCommandPostHandler
}])

server.route({
    method: 'GET',
    path: '/test',
    handler: (request, h) => {
        const response = h.response({test : "message"})
        response.code(402)
        return response
    }
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