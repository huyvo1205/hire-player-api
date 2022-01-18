import * as CreateError from "http-errors"
import DonateConstant from "../constants/DonateConstant"
import UserModel from "../models/UserModel"
import DonateModel from "../models/DonateModel"

class DonateValidator {
    async validateCreateDonate({ toUser, fromUser, amount }) {
        const { money } = fromUser
        if (amount > money) {
            throw new CreateError.BadRequest(DonateConstant.ERROR_CODES.ERROR_USER_NOT_ENOUGH_MONEY)
        }
        const user = await UserModel.findById(toUser)
        if (!user) {
            throw new CreateError.NotFound(DonateConstant.ERROR_CODES.ERROR_TO_USER_NOT_FOUND)
        }
        return user
    }

    async validateGetDonate(id) {
        const donate = await DonateModel.findById(id)
        if (!donate) {
            throw new CreateError.NotFound(DonateConstant.ERROR_CODES.ERROR_DONATE_NOT_FOUND)
        }
        return donate
    }

    async validateReplyDonate({ toUser, userLoginId, oldReplyMessage }) {
        if (toUser.toString() !== userLoginId.toString()) {
            throw new CreateError.BadRequest(DonateConstant.ERROR_CODES.ERROR_ONLY_RECEIVER_REPLY_DONATE)
        }
        if (oldReplyMessage) {
            throw new CreateError.BadRequest(DonateConstant.ERROR_CODES.ERROR_THIS_DONATE_ALREADY_REPLY)
        }
    }
}

export default new DonateValidator()
