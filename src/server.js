'use strict'

const Hapi = require('hapi')
require('./database')
const handlers = require('./handlers')
const socketio = require('socket.io')
const netpie = require('./netpie')


const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
        cors: {
            origin: ['*'],
        }
    }
})


const io = socketio.listen(server.listener)
io.on('connection', (socket) => {
    console.log('socket connected ... ')
    socket.emit('hello', {
        say: 'hello'
    })

    socket.on("sayback", (data) => {
        socket.emit('hello-again', {
            say: 'WTF!!'
        })
    })

    netpie.on('message', function (topic, body) {
        console.log('incoming topic: ' + topic + '\tmessage: ' + body);
        if (topic == '/ihere/door/status') {
            // TODO : handler command
            socket.emit('/door/activities', body)
        }
    });
})

server.app.io = io 


// page not found handle
const handler = function (request, h) {
    return h.response('The page was not found').code(404);
};
server.route({ method: '*', path: '/{p*}', handler });

server.route([
    {
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
    path: '/verify/serialnumber',
    handler: handlers.default.verifySerialNumber
}])

server.route([{
    method: 'POST',
    path: '/door/command',
    handler: handlers.default.doorCommandPostHandler
}])

server.route([
    {
        method: 'POST',
        path: '/config/detection',
        handler: handlers.default.setConfigDetection
    },
    {
        method: 'POST',
        path: '/config/verifymobile',
        handler: handlers.default.setConfigVerifyMobile
    }
])

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
        
        await server.start()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
    console.log('Server running at:', server.info.uri)
}

start()