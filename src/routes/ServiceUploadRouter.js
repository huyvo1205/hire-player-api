import express from "express"
import ServiceUploadController from "../controllers/ServiceUploadController"
import auth from "../middlewares/auth"
import "express-async-errors"

const router = express.Router()
/**
 * @swagger
 * /api/service-upload/upload-images-chat:
 *   post:
 *     summary: Upload Images Chat
 *     security:
 *       - bearerAuth: []
 *     tags: [Upload Images Chat]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: images
 *         description: "Key files upload is images
 *           <br> - Max size 5MB
 *           <br> - Max files 10"
 *         in: form
 *         schema:
 *              type: file
 *     responses:
 *       200:
 *         description: "The response has fields
 *           <br> - data{files: [Array Images]}
 *           <br> - message=UPLOAD_IMAGES_CHAT_SUCCESS"
 */
router.post("/upload-images-chat", auth(), ServiceUploadController.uploadImagesChat)

export default router
