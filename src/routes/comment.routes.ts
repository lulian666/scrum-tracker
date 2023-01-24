import express, { Router } from 'express'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import activityController from '@/controllers/activity.controller'

const router: Router = express.Router()

router
    .route('/:boardId/cards/:cardId/comments')
    .post(
        authenticationMiddleware.authenticateUser,
        activityController.createComment
    )

router
    .route('/:boadId/cards/:cardId/attachments')
    .post(
        // authenticationMiddleware.authenticateUser,
        activityController.createAttachment
    )

router
    .route('/:boadId/cards/:cardId/attachments/:attachmentId')
    .delete(
        authenticationMiddleware.authenticateUser,
        activityController.deleteAttachment
    )

export default router
