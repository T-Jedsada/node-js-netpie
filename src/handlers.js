const Boom = require('boom')
const ActivityModel = require('./model/activity-model')
const netpie = require('./netpie')

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
            return activity.save().then(() => {
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