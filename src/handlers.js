const Boom = require('boom')
const ActivityModel = require('./model/activity-model')
const netpie = require('./netpie')
// const {io} = require('./socketio')

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
            activity.token = request.payload.token
            return activity.save().then(data => {
                request.server.app.io.sockets.emit(`${activity.serialNumber}/new/activity`, data)
                return {
                    message: "success create"
                }
            }).catch(_ => {
                Boom.badImplementation('something went wrong while saving activitie .')
            })
        }

        this.getActivities = (request, h) => {
            const {
                serialNumber,
                offset,
                size
            } = request.query
            const activities = ActivityModel.find({
                    serialNumber
                })
                .sort('-timestamp')
                .skip(parseInt(offset || 0))
                .limit(parseInt(size || 5))
                .exec()
            const totalActivity = ActivityModel.countDocuments({
                serialNumber
            }).exec()
            return Promise.all([activities, totalActivity]).then(([data, total]) => {
                return {
                    data,
                    total
                }
            }).catch(err => {
                console.log(err)
                return Boom.badImplementation('something went wrong while query activitie .')
            })

        }
    }
}

exports.default = new Handler()