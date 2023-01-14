import Joi from 'joi'

const create = Joi.object({
    name: Joi.string().required().min(2).max(20).trim(),
    description: Joi.string().max(200),
    logo: Joi.string().required(),
})

export default {
    create,
}
