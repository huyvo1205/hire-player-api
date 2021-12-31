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
        const countHire = await HireModel.countDocuments({ _id: hireId })
        if (!countHire) throw new CreateError.NotFound(HireConstant.ERROR_CODES.ERROR_HIRE_NOT_FOUND)
        return countHire
    }
}

export default new HireValidator()
