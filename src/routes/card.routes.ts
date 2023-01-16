import express, { Router } from 'express'
import cardController from '@/controllers/card.controller'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/Card.validation'

const router: Router = express.Router()

router
    .route('/')
    .post(
        authenticationMiddleware.authenticateUser,
        // validationMiddleware(validation.create),
        cardController.createCard
    )
    .get(cardController.getBoardCards)
router
    .route('/myCards')
    .get(authenticationMiddleware.authenticateUser, cardController.getUserCards)
router
    .route('/:cardId')
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
