import express, { Router } from 'express'
import validationMiddleware from '@/middleware/validation.middleware'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import validation from '@/models/Board.validation'
import boardController from '@/controllers/board.controller'
import imageAttachedMiddleware from '@/middleware/imageAttached.middleware'
import uploadsController from '@/controllers/uploads.controller'

const router: Router = express.Router()

// get all boards(admin)
router
    .route('/')
    .post(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.create),
        boardController.createBoard
    )
    .get(
        authenticationMiddleware.authenticateUser,
        authenticationMiddleware.authorizePermissions,
        boardController.getAllBoards
    )

router
    .route('/uploadScrumLogo')
    .post(
        authenticationMiddleware.authenticateUser,
        imageAttachedMiddleware.shouldAttachImage,
        uploadsController.uploadScrumLogo
    )

// get user's boards
router
    .route('/myBoards')
    .get(
        authenticationMiddleware.authenticateUser,
        boardController.getUserBoards
    )

router
    .route('/:boardId/notification')
    .patch(
        authenticationMiddleware.authenticateUser,
        boardController.updateSubscription
    )

router
    .route('/members')
    .get(
        authenticationMiddleware.authenticateUser,
        boardController.getBoardMembers
    )

router
    .route('/:boardId')
    .patch(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.update),
        boardController.updateBoard
    )
    .get(
        authenticationMiddleware.authenticateUser,
        boardController.getSingleBoard
    )
    .delete(
        authenticationMiddleware.authenticateUser,
        boardController.deleteBoard
    )
export default router
