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

export default {
    register,
    login,
}