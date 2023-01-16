import express, { Router } from 'express'
import authController from '@/controllers/auth.controller'
import validationMiddleware from '@/middleware/validation.middleware'
import validation from '@/models/User.validation'
import authenticationMiddleware from '@/middleware/authentication.middleware'

const router: Router = express.Router()

router.post(
    '/register',
    validationMiddleware(validation.register),
    authController.register
)

router.post(
    '/loginin',
    validationMiddleware(validation.login),
    authController.loginin
)

router.get(
    '/access-token',
    authenticationMiddleware.authenticateUser,
    authController.loginWithAccessToken
)

// router.post(
//     '/login',
//     validationMiddleware(validation.login),
//     authController.login
// )
router.post(
    '/verify-email',
    validationMiddleware(validation.verifyEmail),
    authController.verifyEmail
)
router.post(
    '/reset-password',
    validationMiddleware(validation.resetPassword),
    authController.resetPassword
)
router.post(
    '/forgot-password',
    validationMiddleware(validation.forgotPassword),
    authController.forgotPassword
)
router.delete(
    '/logout',
    authenticationMiddleware.authenticateUser,
    authController.logout
)
export default router
