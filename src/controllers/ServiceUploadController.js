import ConversationConstant from "../constants/ConversationConstant"
import UploadFileMiddleware from "../middlewares/UploadFileMiddleware"

class ServiceUploadController {
    async uploadImagesChat(req, res) {
        const KEY = "CHAT"
        const files = await UploadFileMiddleware.uploadFiles(KEY, req, res)
        return res.status(200).send({
            data: { files },
            message: ConversationConstant.SUCCESS_CODES.UPLOAD_IMAGES_CHAT_SUCCESS
        })
    }
}

export default new ServiceUploadController()
