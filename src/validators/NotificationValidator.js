import * as CreateError from "http-errors"
import NotificationConstant from "../constants/NotificationConstant"
import NotificationModel from "../models/NotificationModel"

class NotificationValidator {
    async validateGetNotification(id) {
        const notification = await NotificationModel.findOne({ _id: id })
        if (!notification) throw new CreateError.NotFound(NotificationConstant.ERROR_CODES.ERROR_NOTIFICATION_NOT_FOUND)
        return notification
    }
}

export default new NotificationValidator()
