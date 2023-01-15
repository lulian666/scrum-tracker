import express, { Router } from 'express'
import taskController from '@/controllers/task.controller'
import authenticationMiddleware from '@/middleware/authentication.middleware'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/Task.validation'

const router: Router = express.Router()

router
    .route('/')
    .post(
        authenticationMiddleware.authenticateUser,
        validationMiddleware(validation.create),
        taskController.createTask
    )
router
    .route('/myTasks')
    .get(authenticationMiddleware.authenticateUser, taskController.getUserTasks)
router
    .route('/:id')
    .get(
        authenticationMiddleware.authenticateUser,
        taskController.getSingleTask
    )
    .patch(
        authenticationMiddleware.authenticateUser,
        taskController.updatedTask
    )
    .delete(
        authenticationMiddleware.authenticateUser,
        taskController.deleteTask
    )

export default router
