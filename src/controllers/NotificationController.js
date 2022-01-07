import NotificationConstant from "../constants/NotificationConstant"
import pick from "../utils/pick"
import NotificationService from "../services/NotificationService"

class NotificationController {
    async getNotifications(req, res) {
        const userIdLogin = req.user.id
        const filter = { receiver: userIdLogin }
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const notifications = await NotificationService.getListNotifications(filter, options)
        return res.status(200).send({
            data: notifications,
            message: NotificationConstant.SUCCESS_CODES.GET_NOTIFICATIONS_SUCCESS
        })
    }

    async getDetailNotification(req, res) {
        const notificationId = req.params.id
        const notification = await NotificationService.getDetailNotification(notificationId)
        res.status(200).send({
            data: notification,
            message: NotificationConstant.SUCCESS_CODES.GET_DETAIL_NOTIFICATION_SUCCESS
        })
    }
}

export default new NotificationController()
