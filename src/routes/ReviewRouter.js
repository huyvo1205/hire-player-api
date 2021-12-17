import express from "express"
import ReviewController from "../controllers/ReviewController"
import { validateBody } from "../validators"
import ReviewSchema from "../schemas/ReviewSchema"
import auth from "../middlewares/auth"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         starPoint:
 *           type: integer
 *         content:
 *           type: number
 *         reviewer:
 *           type: string
 *         receiver:
 *           type: string
 *         status:
 *           type: integer
 *           description: "ACTIVE: 1, INACTIVE: 2"
 *           default: 1
 *           enum:
 *           - 1
 *           - 2
 *         deletedAt:
 *           type: string
 *           format: "date-time"
 *         createdAt:
 *           type: string
 *           format: "date-time"
 *         updatedAt:
 *           type: string
 *           format: "date-time"
 */
const router = express.Router()
/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get Reviews
 *     tags: [Get Reviews]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: reviewerId
 *         description: "User Id Reviewer"
 *         in: query
 *         schema:
 *              type: string
 *       - name: receiverId
 *         description: "User Id Receiver"
 *         in: query
 *         schema:
 *              type: string
 *       - name: status
 *         description: "Status Player: ACTIVE: 1, INACTIVE: 2"
 *         in: query
 *         schema:
 *              type: integer
 *       - name: starPoint
 *         description: "Star Point"
 *         in: query
 *         schema:
 *              type: integer
 *       - name: sortBy
 *         description: "Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)"
 *         in: query
 *         schema:
 *              type: string
 *       - name: limit
 *         description: "Maximum number of results per page (default = 10)"
 *         in: query
 *         schema:
 *              type: string
 *       - name: page
 *         description: "Current page (default = 1)"
 *         in: query
 *         schema:
 *              type: string
 *       - name: populate
 *         description: "Populate data fields. Only support 1 level and custom take fields
 *                       <br> EXAMPLE_1: populate=user:firstName,lastName
 *                       <br> -> populate user and only take 2 fields firstName, lastName
 *                       <br> EXAMPLE_2: populate=user:-firstName,-lastName
 *                       <br> -> populate user and take all fields except firstName, lastName
 *                       <br> EXAMPLE_3: populate=user
 *                       <br> -> populate user and take all fields
 *                      "
 *         in: query
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {results[], page, limit, totalPages, totalResults}
 *           <br> - message=GET_REVIEWS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router.get("/", ReviewController.getReviews)
/**
 * @swagger
 * /api/reviews/:id:
 *   get:
 *     summary: Get Detail Review
 *     tags: [Get Detail Review]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Review Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=GET_DETAIL_REVIEW_SUCCESS
 *       404:
 *         description: Not Found
 *           <br> - ERROR_REVIEW_NOT_FOUND
 */
router.get("/:id", ReviewController.getDetailReview)
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create Review
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Review]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: starPoint
 *         description: "Star Point"
 *         in: body
 *         schema:
 *              type: integer
 *         required: true
 *       - name: content
 *         description: "Content"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *       - name: reviewerId
 *         description: "User Id Reviewer"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *       - name: receiverId
 *         description: "User Id Receiver"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data{Review}
 *           <br> - message=CREATE_REVIEW_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_USER_REVIEWER_NOT_FOUND
 *           <br> - ERROR_USER_RECEIVER_NOT_FOUND
 */
router.post("/", auth(), validateBody(ReviewSchema.createReview), ReviewController.createReview)
/**
 * @swagger
 * /api/reviews/:id:
 *   put:
 *     summary: Update Review
 *     security:
 *       - bearerAuth: []
 *     tags: [Update Review]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Review Id"
 *         in: path
 *         schema:
 *              type: string
 *       - name: starPoint
 *         description: "Star Point"
 *         in: body
 *         schema:
 *              type: integer
 *       - name: content
 *         description: "Content"
 *         in: body
 *         schema:
 *              type: string
 *       - name: reviewerId
 *         description: "User Id Reviewer"
 *         in: body
 *         schema:
 *              type: string
 *       - name: receiverId
 *         description: "User Id Receiver"
 *         in: body
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Review}
 *           <br> - message=UPDATE_REVIEW_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_REVIEW_NOT_FOUND
 */
router.put("/:id", auth(), validateBody(ReviewSchema.updateReview), ReviewController.updateReview)
/**
 * @swagger
 * /api/reviews/:id:
 *   delete:
 *     summary: Delete Review
 *     security:
 *       - bearerAuth: []
 *     tags: [Delete Review]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Review Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=DELETE_REVIEW_SUCCESS
 *       404:
 *         description: Not Found
 *           <br> - ERROR_REVIEW_NOT_FOUND
 */
router.delete("/:id", auth(), ReviewController.deleteReview)
export default router
