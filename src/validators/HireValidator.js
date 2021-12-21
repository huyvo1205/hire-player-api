import * as CreateError from "http-errors"
import * as _ from "lodash"
import HireConstant from "../constants/HireConstant"
import UserModel from "../models/UserModel"
import ConversationModel from "../models/ConversationModel"
import MessageModel from "../models/MessageModel"
import HireModel from "../models/HireModel"

class HireValidator {
    async validateCreateHire({ playerId, customerId }) {
        const countPlayer = await UserModel.countDocuments({ _id: playerId })
        if (!countPlayer) throw new CreateError.NotFound(HireConstant.ERROR_CODES.ERROR_PLAYER_ID_INVALID)
        const countCustomer = await UserModel.countDocuments({ _id: customerId })
        if (!countCustomer) throw new CreateError.NotFound(HireConstant.ERROR_CODES.ERROR_CUSTOMER_ID_INVALID)
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
