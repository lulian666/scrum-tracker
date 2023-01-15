import express, { Router } from 'express'
import validationMiddleware from '@/middleware/validation.middleware'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import validation from '@/models/Scrum.validation'
import scrumController from '@/controllers/scrum.controller'
import imageAttachedMiddleware from '@/middleware/imageAttached.middleware'
import uploadsController from '@/controllers/uploads.controller'

const router: Router = express.Router()

// get all scrums(admin)
router
    .route('/')
    .post(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.create),
        scrumController.createScrum
    )
    .get(
        authenticationMiddleware.authenticateUser,
        authenticationMiddleware.authorizePermissions,
        scrumController.getAllScrums
    )

router
    .route('/uploadScrumLogo')
    .post(
        imageAttachedMiddleware.shouldAttachImage,
        uploadsController.uploadScrumLogo
    )

// get user's scrums
router
    .route('/myScrums')
    .get(
        authenticationMiddleware.authenticateUser,
        scrumController.getUserScrums
    )

router
    .route('/:id')
    .patch(
        authenticationMiddleware.authenticateUser,
        scrumController.updateScrum
    )
    .get(
        authenticationMiddleware.authenticateUser,
        scrumController.getSingleScrum
    )
    .delete(
        authenticationMiddleware.authenticateUser,
        scrumController.deleteScrum
    )

export default router
