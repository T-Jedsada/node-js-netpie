const Boom = require('boom')
const ActivityModel = require('./model/activity-model')
const serialNumberModel = require('./model/serialnumber-model')
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

        this.verifySerialNumber = (request, h) => {
            const {
                serial_number
            } = request.payload

            if (!serial_number) {
                return Boom.badRequest("serial_number is required .")
            }

            return serialNumberModel.countDocuments({
                serialNumber: serial_number
            }).exec().then(result => {
                if (result) {
                    return {
                        message: 'serial number is verified .'
                    }
                }
                return Boom.unauthorized('serial number is invalid .')
            }).catch(_ => {
                return Boom.badImplementation('something went wrong while verify serial number .')
            })
        }

        this.setConfigDetection = (request, h) => {
            const { is_detect } = request.payload
            if(!is_detect) {
                return Boom.badRequest('is_detect key is required .')
            }
            netpie.publish("/config/detect_face", is_detect.toString(), true)
            return {
                message: "successfully"
            }
        }


        this.setConfigVerifyMobile = (request, h) => {
            const { is_verify_mobile } = request.payload
            if(!is_verify_mobile) {
                return Boom.badRequest('is_verify_mobile key is required .')
            }
            netpie.publish("/config/verify_mobile", is_verify_mobile.toString(), true)
            return {
                message: "successfully"
            }
        }

        this.getToken = (request, h) => {
            const agreegate = [
                {
                    $group: {
                        _id: '$token',
                        count: { $sum: 1 }
                    }
                }
            ]

            return ActivityModel
                .aggregate(agreegate)
                .exec()
                .then(tokens => tokens.map(token => ({ token: token._id, count: token.count})))
                .catch(err => {
                    console.log(err)
                    return Boom.badImplementation('something went wrong . ')
                })
        }
    }
}

exports.default = new Handler()