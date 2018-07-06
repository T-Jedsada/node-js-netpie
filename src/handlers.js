const Boom = require('boom')
const ActivityModel = require('./model/activity-model')
const netpie = require('./netpie')
const socket = require('./socketio')

class Handler {
    constructor() {
        this.doorCommandPostHandler = (request, _) => {
            const command = request.payload.command
            netpie.publish("/door", command, true)
            return {
                message: "successfully"
            }
        }

        this.saveActivity = (request, _) => {
            var activity = new ActivityModel()
            activity.timestamp = request.payload.timestamp
            activity.urlImage = request.payload.urlImage
            activity.serialNumber = request.payload.serialNumber
            return activity.save().then(data => {
                socket.io.sockets.emit('/new/activity', data)
                return {
                    message: "success create"
                }
            }).catch(_ => {
                Boom.badImplementation('something went wrong while saving activitie .')
            })
        }

        this.getActivities = (request, h) => {
            return ActivityModel.find({}).then(data => {
                return data
            }).catch(_ => {
                Boom.badImplementation('something went wrong while query activitie .')
            })
        }
    }
}

exports.default = new Handler()