import NotificationModel from "../models/NotificationModel"
import NotificationConstant from "../constants/NotificationConstant"

class NotificationService {
    async createNotification(data, isPopulate = true) {
        const newNotification = await NotificationModel.create(data)
        if (isPopulate) {
            return NotificationModel.findById(newNotification.id)
                .populate(NotificationConstant.POPULATE_CUSTOMER)
                .populate(NotificationConstant.POPULATE_PLAYER)
                .populate(NotificationConstant.POPULATE_HIRE)
        }
        return newNotification
    }

    async updateNotification(id, updateData, isPopulate = true) {
        const newNotification = await NotificationModel.updateOne({ _id: id }, updateData)
        if (isPopulate) {
            const Notification = await NotificationModel.findById(id)
                .populate(NotificationConstant.POPULATE_CUSTOMER)
                .populate(NotificationConstant.POPULATE_PLAYER)
                .populate(NotificationConstant.POPULATE_HIRE)
            return Notification
        }
        return newNotification
    }

    async getDetailNotification(id) {
        return NotificationModel.findOne({ _id: id })
            .populate(NotificationConstant.POPULATE_CUSTOMER)
            .populate(NotificationConstant.POPULATE_PLAYER)
            .populate(NotificationConstant.POPULATE_HIRE)
    }

    async deleteNotification(id) {
        return NotificationModel.deleteOne({ _id: id })
    }

    async getListNotifications(filter, options) {
        const notifications = await NotificationModel.paginate(filter, options)
        return notifications
    }
}

export default new NotificationService()
