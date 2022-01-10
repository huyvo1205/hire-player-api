import * as CreateError from "http-errors"
import DonateConstant from "../constants/DonateConstant"
import UserModel from "../models/UserModel"

class DonateValidator {
    async validateCreateDonate({ toUser, fromUser, amount }) {
        const { money } = fromUser
        if (amount > money) {
            throw new CreateError.BadRequest(DonateConstant.ERROR_CODES.ERROR_USER_NOT_ENOUGH_MONEY)
        }
        const user = await UserModel.findById(toUser).lean()
        if (!user) {
            throw new CreateError.NotFound(DonateConstant.ERROR_CODES.ERROR_TO_USER_NOT_FOUND)
        }
    }
}

export default new DonateValidator()
