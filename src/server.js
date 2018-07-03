const Hapi = require('hapi')
require('./database')
const handlers = require('./handlers')

const server = Hapi.server({
    port: process.env.PORT || 8000
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