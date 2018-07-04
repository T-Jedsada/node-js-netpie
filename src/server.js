const Hapi = require('hapi')
require('./database')
const handlers = require('./handlers')
const socketServer = require('./socketio')


const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: 'localhost',
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
    handler: handlers.default.doorCommandPostHandler
}])

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        const response = h.response({
            test: "fucking shit!!!"
        })
        response.code(404)
        return response
    }
})


async function start() {
    try {
        await server.register(require('vision'))
        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './views',
        })
        
        server.route({
            method: 'GET',
            path: '/testsocketio',
            handler: (req, h) => {
                return h.view('index')
            }
        })
        await socketServer.listen(4001)
        await server.start()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
    console.log('Server running at:', server.info.uri)
}

start()