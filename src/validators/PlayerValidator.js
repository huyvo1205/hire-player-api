import * as CreateError from "http-errors"
import { ERROR_CODES } from "../constants/UserConstant"
import PlayerConstant from "../constants/PlayerConstant"
import UserModel from "../models/UserModel"
import PlayerModel from "../models/PlayerModel"

class PlayerValidator {
    async validateCreatePlayerInfo({ userId }) {
        const countUser = await UserModel.countDocuments({ _id: userId })
        if (!countUser) throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND)
        const countPlayer = await PlayerModel.countDocuments({ user: userId })
        if (countPlayer)
            throw new CreateError.BadRequest(PlayerConstant.ERROR_CODES.ERROR_USER_ALREADY_CREATE_PLAYER_INFO)
    }

    async validateUpdatePlayerInfo({ playerId }) {
        const player = await PlayerModel.findOne({ _id: playerId })
        if (!player) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_PLAYER_NOT_FOUND)
        return player
    }
}

export default new PlayerValidator()
