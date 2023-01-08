import Joi from 'joi'

const register = Joi.object({
    name: Joi.string().required().min(2).max(16).trim(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(24),
    role: Joi.string().valid('user', 'admin'),
})

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(24),
})

const verifyEmail = Joi.object({
    verificationToken: Joi.string().required(),
    email: Joi.string().email().required,
})

const forgotPassword = Joi.object({
    email: Joi.string().email().required(),
})

const resetPassword = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    newPassword: Joi.string().required(),
})

export default {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
}
