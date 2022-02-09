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

    async updatePlayer(req, res) {
        const userId = req.params.id
        await PlayerValidator.validateUpdatePlayerInfo({ userId })
        const updateData = { ...req.body }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(userId, updateData)
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPDATE_PLAYER_INFO_SUCCESS
        })
    }

    async updatePlayerInfo(req, res) {
        const userId = req.params.id
        const oldPlayer = await PlayerValidator.validateGetPlayer(userId)
        const oldPlayerInfo = oldPlayer.playerInfo
        const dataUpdate = {
            playerInfo: { ...oldPlayerInfo, ...req.body }
        }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(userId, dataUpdate)
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPDATE_PLAYER_INFO_SUCCESS
        })
    }

    async updateHireSettings(req, res) {
        const userId = req.params.id
        const oldPlayer = await PlayerValidator.validateGetPlayer(userId)
        const oldPlayerInfo = oldPlayer.playerInfo
        const dataUpdate = {
            playerInfo: { ...oldPlayerInfo, ...req.body }
        }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(userId, dataUpdate)
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPDATE_HIRE_SETTINGS_SUCCESS
        })
    }

    async getDetailPlayerInfo(req, res) {
        const userId = req.params.id
        const player = await PlayerValidator.validateGetPlayer(userId)
        res.status(200).send({
            data: player,
            message: PlayerConstant.SUCCESS_CODES.GET_DETAIL_PLAYER_INFO_SUCCESS
        })
    }

    async getStatistics(req, res) {
        const playerId = req.params.id
        const player = await PlayerValidator.validateGetPlayer(playerId)
        const { avgRating } = player.playerInfo
        const result = await PlayerService.getStatistics(playerId)
        result.avgRate = avgRating
        res.status(200).send({
            data: result,
            message: PlayerConstant.SUCCESS_CODES.GET_STATISTICS_PLAYER_SUCCESS
        })
    }

    async getStatisticConditions(req, res) {
        res.status(200).send({
            data: {
                hotPlayer: PlayerConstant.PLAYER_CONDITIONS.HOT_PLAYER,
                vipPlayer: PlayerConstant.PLAYER_CONDITIONS.VIP_PLAYER
            },
            message: PlayerConstant.SUCCESS_CODES.GET_STATISTIC_CONDITIONS_SUCCESS
        })
    }

    async uploadImagesPlayerInfo(req, res) {
        const KEY = "IMAGES"
        const playerId = req.params.id
        const player = await PlayerValidator.validateUpdatePlayerInfo({ userId: playerId })
        const files = await UploadFileMiddleware.uploadFiles(KEY, req, res)
        const oldImages = [...player.playerInfo.images]
        const imagesUpload = [...files]
        const newImages = [...files, ...oldImages]
        await PlayerValidator.validateUploadPlayerImages({ newImages, key: KEY, imagesUpload })
        const updateData = { "playerInfo.images": newImages }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(playerId, updateData)
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPLOAD_IMAGES_SUCCESS
        })
    }

    async uploadAvatarPlayerInfo(req, res) {
        const KEY = "AVATAR"
        const playerId = req.params.id
        const player = await PlayerValidator.validateUpdatePlayerInfo({ userId: playerId })
        const files = await UploadFileMiddleware.uploadFiles(KEY, req, res)
        const avatar = files.length ? files[0] : {}
        const updateData = { "playerInfo.playerAvatar": avatar }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(playerId, updateData)
        /* remove old avatar */
        const oldAvatar = player.playerInfo.playerAvatar || null
        if (oldAvatar && oldAvatar.filename) {
            await FileHelper.removeFilesFromDisk({ files: [oldAvatar], key: KEY })
        }
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.UPLOAD_AVATAR_SUCCESS
        })
    }

    async removeImagesPlayerInfo(req, res) {
        const KEY = "IMAGES"
        const { images = [] } = req.body
        const playerId = req.params.id
        const player = await PlayerValidator.validateUpdatePlayerInfo({ userId: playerId })
        const imagesFilename = images.map(file => file.filename)
        const newImages = player.playerInfo.images.filter(image => !imagesFilename.includes(image.filename))
        const updateData = { "playerInfo.images": newImages }
        const updatePlayerInfo = await PlayerService.updatePlayerInfo(playerId, updateData)
        await FileHelper.removeFilesFromDisk({ files: images, key: KEY })
        res.status(200).send({
            data: updatePlayerInfo,
            message: PlayerConstant.SUCCESS_CODES.REMOVE_IMAGES_SUCCESS
        })
    }
}

export default new PlayerController()
