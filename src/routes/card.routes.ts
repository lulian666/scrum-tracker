import express, { Router } from 'express'
import cardController from '@/controllers/card.controller'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/Card.validation'

const router: Router = express.Router()

router
    .route('/:boardId/lists/:listId/cards')
    .post(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.create),
        cardController.createCard
    )
router
    .route('/:boardId/cards')
    .get(
        authenticationMiddleware.authenticateUser,
        cardController.getBoardCards
    )

router
    .route('/:boardId/lists/:listId/cards/:cardId')
    .get(
        authenticationMiddleware.authenticateUser,
        cardController.getSingleCard
    )

router
    .route('/:boardId/cards/:cardId')
    .patch(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.update),
        cardController.updateCard
    )
    .delete(
        authenticationMiddleware.authenticateUser,
        cardController.deleteCard
    )

export default router
