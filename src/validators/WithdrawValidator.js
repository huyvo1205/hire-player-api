import * as CreateError from "http-errors"
import WithdrawConstant from "../constants/WithdrawConstant"

class WithdrawValidator {
    validateWithdraw({ totalAmount, money }) {
        if (money < totalAmount) {
            throw new CreateError.BadRequest(WithdrawConstant.ERROR_CODES.ERROR_USER_NOT_ENOUGH_MONEY)
        }
    }
}

export default new WithdrawValidator()
