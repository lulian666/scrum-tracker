import express, { Router } from 'express'
import authController from '@/controllers/auth.controller'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/User.validation'

const router: Router = express.Router()

router.post('/register', validationMiddleware(validation.register), authController.register)
router.post('/login', validationMiddleware(validation.login), authController.login)
router.post('/verify-email', authController.verifyEmail)
router.post('/reset-password', authController.resetPassword)
router.post('/forgot-password', authController.forgotPassword)
router.delete('/logout', authController.logout)
export default router