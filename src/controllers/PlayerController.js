/* eslint-disable no-underscore-dangle */
import PlayerConstant from "../constants/PlayerConstant"
import PlayerValidator from "../validators/PlayerValidator"
import PlayerService from "../services/PlayerService"
import pick from "../utils/pick"
import UploadFileMiddleware from "../middlewares/UploadFileMiddleware"
import FileHelper from "../helpers/FileHelper"

class PlayerController {
    async getPlayersInfo(req, res) {
        const { userId, status, typePlayer } = req.query
        const filter = { isPlayer: true }
        if (userId) filter._id = userId
        if (status) filter["playerInfo.status"] = status
        if (typePlayer) filter["playerInfo.typePlayer"] = typePlayer

        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const players = await PlayerService.getListPlayerInfo(filter, options)
        return res.status(200).send({
            data: players,
            message: PlayerConstant.SUCCESS_CODES.GET_PLAYER_INFO_SUCCESS
        })
    }

    async updatePlayerInfo(req, res) {
        const playerId = req.params.id
        await PlayerValidator.validateUpdatePlayerInfo({ playerId })
        const updateData = { ...req.body }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(playerId, updateData)
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPDATE_PLAYER_INFO_SUCCESS
        })
    }

    async getDetailPlayerInfo(req, res) {
        const userId = req.params.id
        await PlayerValidator.validateUpdatePlayerInfo({ userId })
        const player = await PlayerService.getDetailPlayerInfo(userId)
        res.status(200).send({
            data: player,
            message: PlayerConstant.SUCCESS_CODES.GET_DETAIL_PLAYER_INFO_SUCCESS
        })
    }

    async uploadImagesPlayerInfo(req, res) {
        const KEY = "IMAGES"
        const playerId = req.params.id
        const player = await PlayerValidator.validateUpdatePlayerInfo({ playerId })
        const files = await UploadFileMiddleware.uploadFiles(KEY, req, res)
        const updateData = { images: files }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(playerId, updateData)
        const imagesOld = player.images
        FileHelper.removeFilesFromDisk({ key: KEY, files: imagesOld })
        /* remove images old */
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPLOAD_IMAGES_SUCCESS
        })
    }
}

export default new PlayerController()
