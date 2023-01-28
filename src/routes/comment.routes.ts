import express, { Router } from 'express'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import activityController from '@/controllers/activity.controller'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/Activity.validation'
import imageAttachedMiddleware from '@/middleware/imageAttached.middleware'

const router: Router = express.Router()

router
    .route('/:boardId/cards/:cardId/comments')
    .post(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.createComment),
        activityController.createComment
    )

router.route('/:boadId/cards/:cardId/attachments').post(
    // authenticationMiddleware.authenticateUser,
    imageAttachedMiddleware.shouldAttachImage,
    activityController.createAttachment
)

router
    .route('/:boadId/cards/:cardId/attachments/:attachmentId')
    .delete(
        authenticationMiddleware.authenticateUser,
        activityController.deleteAttachment
    )

export default router
