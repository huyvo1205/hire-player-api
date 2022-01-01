import * as CreateError from "http-errors"
import MomentTimezone from "moment-timezone"
import HireConstant from "../constants/HireConstant"
import PlayerConstant from "../constants/PlayerConstant"
import UserModel from "../models/UserModel"
import HireModel from "../models/HireModel"
import { TIME_ZONE } from "../constants/GlobalConstant"

class HireValidator {
    async validateCreateHire({ playerId, timeRent }) {
        const hourNow = MomentTimezone().tz(TIME_ZONE).hours()
        console.log("hourNow", hourNow)
        const player = await UserModel.findOne({ _id: playerId })
        if (!player) throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_PLAYER_ID_INVALID)
        /* validate */
        const { isPlayer } = player
        const { isReceiveHire, timeMaxHire, statusHire } = player.playerInfo
        if (!isPlayer) throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_USER_NOT_PLAYER)
        if (!isReceiveHire) throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_PLAYER_NOT_RECEIVE_HIRE)
        if (statusHire === PlayerConstant.STATUS_HIRE.BUSY)
            throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_PLAYER_BUSY)
        if (timeRent > timeMaxHire) throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_TIME_RENT_TOO_LONG)
    }

    // async validateUpdateMessage({ messageId }) {
    //     const message = await MessageModel.findOne({ _id: messageId })
    //     if (!message) throw new CreateError.NotFound(MessageConstant.ERROR_CODES.ERROR_MESSAGE_NOT_FOUND)
    //     return message
    // }

    async validateGetHire({ hireId }) {
        const hire = await HireModel.findOne({ _id: hireId })
        if (!hire) throw new CreateError.NotFound(HireConstant.ERROR_CODES.ERROR_HIRE_NOT_FOUND)
        return hire
    }

    async validateRequestComplain({ userIdLogin, customerId }) {
        if (userIdLogin !== customerId.toString()) {
            throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_ONLY_CUSTOMER_REQUEST_COMPLAIN)
        }
    }

    async validateComplete({ userIdLogin, playerId, hire }) {
        const { timeRent, acceptedAt } = hire
        const now = MomentTimezone().tz(TIME_ZONE).toISOString()
        const timeRentEnd = MomentTimezone(acceptedAt).tz(TIME_ZONE).add(timeRent, "hours").toISOString()

        const timeNow = +new Date(now)
        const timeEnd = +new Date(timeRentEnd)

        if (timeEnd > timeNow) {
            throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_PLAYER_NOT_COMPLETE_HIRE)
        }

        if (userIdLogin !== playerId.toString()) {
            throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_ONLY_PLAYER_COMPLETE_HIRE)
        }
    }

    async validateRequestFinishSoon({ userIdLogin, customerId }) {
        if (userIdLogin !== customerId.toString()) {
            throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_ONLY_CUSTOMER_REQUEST_COMPLAIN)
        }
    }

    async validateUpdateStatus({ currentHireStep, action }) {
        const validStatusAccept = [HireConstant.HIRE_STEPS.WAITING]
        const validStatusPlayerCancel = [HireConstant.HIRE_STEPS.WAITING]
        const validStatusCustomerCancel = [HireConstant.HIRE_STEPS.WAITING]
        const validStatusComplete = [HireConstant.HIRE_STEPS.ACCEPT, HireConstant.HIRE_STEPS.COMPLAIN]
        const validStatusComplain = [HireConstant.HIRE_STEPS.ACCEPT]
        let isValid = false

        if (action === HireConstant.HIRE_STEPS.ACCEPT) {
            isValid = validStatusAccept.includes(currentHireStep)
        }

        if (action === HireConstant.HIRE_STEPS.PLAYER_CANCEL) {
            isValid = validStatusPlayerCancel.includes(currentHireStep)
        }

        if (action === HireConstant.HIRE_STEPS.CUSTOMER_CANCEL) {
            isValid = validStatusCustomerCancel.includes(currentHireStep)
        }

        if (action === HireConstant.HIRE_STEPS.COMPLETE) {
            isValid = validStatusComplete.includes(currentHireStep)
        }

        if (action === HireConstant.HIRE_STEPS.COMPLAIN) {
            isValid = validStatusComplain.includes(currentHireStep)
        }

        if (!isValid) {
            throw new CreateError.BadRequest(HireConstant.ERROR_CODES.ERROR_STATUS_HIRE_INVALID)
        }
    }
}

export default new HireValidator()
