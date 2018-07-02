const Hapi = require('hapi')
const netpie = require('./netpie')

const APPID = 'ihere'
const server = Hapi.server({
    port: process.env.PORT || 8000
})

const doorCommandPostHandler = function (request, h) {
    const commnad = request.payload.command
    netpie.publish("/ihere/door", commnad);
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
    netpie.connect(APPID)
}

start()