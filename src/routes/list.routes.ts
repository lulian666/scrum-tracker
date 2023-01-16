import express, { Router } from 'express'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import listController from '@/controllers/list.controller'

const router: Router = express.Router()

router
    .route('/')
    .post(
        // authenticationMiddleware.authenticateUser,
        listController.createList
    )
    .get(listController.getBoardLists)

router.route('/:listId').get(listController.getList)

export default router
