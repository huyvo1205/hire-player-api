/* eslint-disable no-underscore-dangle */
import NotificationConstant from "../constants/NotificationConstant"
import pick from "../utils/pick"
import NotificationService from "../services/NotificationService"
import NotificationValidator from "../validators/NotificationValidator"

class NotificationController {
    async getNotifications(req, res) {
        const userIdLogin = req.user.id
        const { latestId } = req.query
        const filter = { receiver: userIdLogin }
        if (latestId) {
            filter._id = { $lt: latestId }
        }
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const notifications = await NotificationService.getListNotifications(filter, options)
        return res.status(200).send({
            data: notifications,
            message: NotificationConstant.SUCCESS_CODES.GET_NOTIFICATIONS_SUCCESS
        })
    }

    async getDetailNotification(req, res) {
        const notificationId = req.params.id
        const notification = await NotificationValidator.validateGetNotification(notificationId)
        res.status(200).send({
            data: notification,
            message: NotificationConstant.SUCCESS_CODES.GET_DETAIL_NOTIFICATION_SUCCESS
        })
    }

    async readNotification(req, res) {
        const notificationId = req.params.id
        await NotificationValidator.validateGetNotification(notificationId)
        const dataUpdate = { isRead: true }
        const newNotification = await NotificationService.updateNotification(notificationId, dataUpdate)
        res.status(200).send({
            data: newNotification,
            message: NotificationConstant.SUCCESS_CODES.READ_NOTIFICATION_SUCCESS
        })
    }

    async readersAllNotifications(req, res) {
        const userIdLogin = req.user.id
        await NotificationService.readersNotifications(userIdLogin)
        res.status(200).send({
            message: NotificationConstant.SUCCESS_CODES.READERS_NOTIFICATIONS_SUCCESS
        })
    }

    async countUnreadNotifications(req, res) {
        const userIdLogin = req.user.id
        const count = await NotificationService.countUnreadNotifications(userIdLogin)
        res.status(200).send({
            data: { count },
            message: NotificationConstant.SUCCESS_CODES.COUNT_UNREAD_NOTIFICATIONS_SUCCESS
        })
    }
}

export default new NotificationController()
