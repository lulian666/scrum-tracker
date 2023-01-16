import express, { Router } from 'express'
import cardController from '@/controllers/card.controller'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/Card.validation'

const router: Router = express.Router()

router.route('/:boardId/lists/:listId/cards').post(
    authenticationMiddleware.authenticateUser,
    // validationMiddleware(validation.create),
    cardController.createCard
)
router
    .route('/:boardId/cards')
    .get(
        authenticationMiddleware.authenticateUser,
        cardController.getBoardCards
    )
router
    .route('/:boardId/cards/myCards')
    .get(authenticationMiddleware.authenticateUser, cardController.getUserCards)
router
    .route('/:boardId/cards/:cardId')
    .get(
        authenticationMiddleware.authenticateUser,
        cardController.getSingleCard
    )
    .patch(
        authenticationMiddleware.authenticateUser,
        cardController.updatedCard
    )
    .delete(
        authenticationMiddleware.authenticateUser,
        cardController.deleteCard
    )

export default router
