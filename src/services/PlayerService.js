import MomentTimezone from "moment-timezone"
import mongoose from "mongoose"
import UserModel from "../models/UserModel"
import HireModel from "../models/HireModel"
import ReviewsModel from "../models/ReviewsModel"
import BalanceFluctuationModel from "../models/BalanceFluctuationModel"
import { TIME_ZONE } from "../constants/GlobalConstant"
import HireConstant from "../constants/HireConstant"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"

class PlayerService {
    async createPlayerInfo(data) {
        const newUser = await UserModel.create(data)
        return newUser
    }

    async updatePlayerInfo(id, updateData) {
        const newUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true })
        return newUser
    }

    async getDetailPlayerInfo(id) {
        return UserModel.findOne({ _id: id })
    }

    async getListPlayerInfo(filter, options) {
        const users = await UserModel.paginate(filter, options)
        return users
    }

    async getStatistics(playerId) {
        /* Doanh thu 7 ngày */
        const dateNow = MomentTimezone().tz(TIME_ZONE).endOf("day").toISOString()
        const sevenDayAgo = MomentTimezone().tz(TIME_ZONE).subtract(7, "days").startOf("day").toISOString()
        const thirtyDayAgo = MomentTimezone().tz(TIME_ZONE).subtract(30, "days").startOf("day").toISOString()

        const conditionRevenue7Day = {
            user: mongoose.Types.ObjectId(playerId),
            createdAt: {
                $gte: new Date(sevenDayAgo),
                $lte: new Date(dateNow)
            },
            action: {
                $in: [
                    BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_DONATE,
                    BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_HIRE
                ]
            },
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS
        }

        const conditionRevenue30Day = {
            createdAt: {
                $gte: new Date(thirtyDayAgo),
                $lte: new Date(dateNow)
            },
            action: {
                $in: [
                    BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_DONATE,
                    BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_HIRE
                ]
            },
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS
        }

        const conditionRatioComplete = {
            player: mongoose.Types.ObjectId(playerId)
        }

        const conditionReview = {
            receiver: mongoose.Types.ObjectId(playerId)
        }

        const countRate = await ReviewsModel.countDocuments(conditionReview)

        const resultRevenue7Day = await BalanceFluctuationModel.aggregate([
            { $match: conditionRevenue7Day },
            {
                $group: {
                    _id: null,
                    sumAmount: { $sum: "$amount" }
                }
            }
        ])

        const resultRevenue30Day = await BalanceFluctuationModel.aggregate([
            { $match: conditionRevenue30Day },
            {
                $group: {
                    _id: "$user",
                    sumAmount: { $sum: "$amount" }
                }
            },
            {
                $sort: { sumAmount: -1 }
            }
        ])

        const resultRatioComplete = await HireModel.aggregate([
            { $match: conditionRatioComplete },
            {
                $group: {
                    _id: null,
                    avgComplete: {
                        $avg: { $cond: [{ $eq: ["$hireStep", HireConstant.HIRE_STEPS.COMPLETE] }, 1, 0] }
                    }
                }
            }
        ])

        const ratioComplete = resultRatioComplete.length ? resultRatioComplete[0].avgComplete : 0
        const sumRevenue7Day = resultRevenue7Day.length ? resultRevenue7Day[0].sumAmount : 0
        const sumRevenue30Day = resultRevenue30Day.length ? resultRevenue30Day : []
        const indexRevenue30DayPlayer = resultRevenue30Day.findIndex(item => item._id.toString() === playerId)
        const valueRevenue30DayPlayer =
            indexRevenue30DayPlayer !== -1 ? sumRevenue30Day[indexRevenue30DayPlayer].sumAmount : 0
        return {
            revenue7Day: sumRevenue7Day,
            revenue30Day: {
                ratings: indexRevenue30DayPlayer + 1,
                revenue: valueRevenue30DayPlayer
            },
            ratioComplete,
            countRate
        }
    }
}

export default new PlayerService()
