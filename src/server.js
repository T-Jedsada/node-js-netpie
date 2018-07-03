const Hapi = require('hapi')
require('./database')
const handlers = require('./handlers')

const server = Hapi.server({
    port: process.env.PORT || 8000,
    routes: {
        cors: {
            origin: ['*']
        }
    }
})

server.route([{
        method: 'GET',
        path: '/activities',
        handler: handlers.default.getActivities
    },
    {
        method: 'POST',
        path: '/activities',
        handler: handlers.default.saveActivity
    },
])

server.route([{
    method: 'POST',
    path: '/door/command',
    handler:handlers.default.doorCommandPostHandler
}])

server.route({
    method: 'GET',
    path: '/test',
    handler: (request, h) => {
        const response = h.response({
            test: "message"
        })
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