import express, { Router } from 'express'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import commentController from '@/controllers/comment.controller'

const router: Router = express.Router()

router
    .route('/:boardId/cards/:cardId/comments')
    .post(
        authenticationMiddleware.authenticateUser,
        commentController.createComment
    )

export default router
