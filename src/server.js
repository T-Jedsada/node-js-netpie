const Hapi = require('hapi')
const netpie = require('./netpie')

const server = Hapi.server({
    port: process.env.PORT || 8000
})

const doorCommandPostHandler = function (request, _) {
    const command = request.payload.command
    netpie.publish("/door", command, true)
    const reponse = {
        message: 'successfully'
    }
    return reponse
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