import NotificationModel from "../models/NotificationModel"
import NotificationConstant from "../constants/NotificationConstant"

class NotificationService {
    async createNotification(data) {
        const newNotification = await NotificationModel.create(data)
        return newNotification
    }

    async updateNotification(id, updateData) {
        const newNotification = await NotificationModel.updateOne({ _id: id }, updateData)
        return newNotification
    }

    async getDetailNotification(id) {
        return NotificationModel.findOne({ _id: id })
    }

    async deleteNotification(id) {
        return NotificationModel.deleteOne({ _id: id })
    }

    async getListNotifications(filter, options) {
        const notifications = await NotificationModel.paginate(filter, options)
        return notifications
    }

    async readersNotifications(receiver) {
        await NotificationModel.updateMany(
            { receiver, isRead: false },
            { $set: { isRead: true } },
            { timestamps: false }
        )
    }
}

export default new NotificationService()
