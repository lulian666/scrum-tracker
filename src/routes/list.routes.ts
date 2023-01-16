import express, { Router } from 'express'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import listController from '@/controllers/list.controller'

const router: Router = express.Router()

router
    .route('/:boardId/lists')
    .post(authenticationMiddleware.authenticateUser, listController.createList)
    .get(
        authenticationMiddleware.authenticateUser,
        listController.getBoardLists
    )

router
    .route('/:boardId/lists/:listId')
    .get(authenticationMiddleware.authenticateUser, listController.getList)

export default router
