import express, { Router } from 'express'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import listController from '@/controllers/list.controller'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/List.validation'

const router: Router = express.Router()

router
    .route('/:boardId/lists')
    .post(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.create),
        listController.createList
    )
    .get(
        authenticationMiddleware.authenticateUser,
        listController.getBoardLists
    )

router
    .route('/:boardId/lists/:listId')
    .get(authenticationMiddleware.authenticateUser, listController.getList)
    .patch(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.update),
        listController.updateList
    )
    .delete(
        authenticationMiddleware.authenticateUser,
        listController.deleteList
    )

export default router
