import PlayerConstant from "../constants/PlayerConstant"
import PlayerValidator from "../validators/PlayerValidator"
import PlayerService from "../services/PlayerService"
import pick from "../utils/pick"
import UploadFileMiddleware from "../middlewares/UploadFileMiddleware"
import FileHelper from "../helpers/FileHelper"

class PlayerController {
    async getPlayersInfo(req, res) {
        const { userId, status } = req.query
        const filter = {}
        if (userId) filter.user = userId
        if (status) filter.status = status
        const options = pick(req.query, ["sortBy", "limit", "page"])
        const players = await PlayerService.getListPlayerInfo(filter, options)
        return res.status(200).send({
            data: players,
            message: PlayerConstant.SUCCESS_CODES.GET_PLAYER_INFO_SUCCESS
        })
    }

    async createPlayerInfo(req, res) {
        const { gameName, rank, costPerHour, description, userId } = req.body
        await PlayerValidator.validateCreatePlayerInfo({ userId })
        const createData = {
            gameName,
            rank,
            costPerHour,
            description,
            user: userId
        }
        const createPlayerInfo = await PlayerService.createPlayerInfo(createData)
        res.status(201).send({
            data: createPlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.CREATE_PLAYER_INFO_SUCCESS
        })
    }

    async updatePlayerInfo(req, res) {
        const playerId = req.params.id
        const { gameName, rank, costPerHour, description } = req.body
        await PlayerValidator.validateUpdatePlayerInfo({ playerId })

        const updateData = {
            gameName,
            rank,
            costPerHour,
            description
        }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(playerId, updateData)
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPDATE_PLAYER_INFO_SUCCESS
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
