import express, { Router } from 'express'
import validationMiddleware from '@/middleware/validation.middleware'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import validation from '@/models/Board.validation'
import notificationController from '@/controllers/notification.controller'

const router: Router = express.Router()

router
    .route('/')
    .get(
        authenticationMiddleware.authenticateUser,
        notificationController.getNotifications
    )
    .post(
        authenticationMiddleware.authenticateUser,
        notificationController.createNotification
    )

router
    .route('/readAll')
    .patch(
        authenticationMiddleware.authenticateUser,
        notificationController.readNotifications
    )

export default router
