import Joi from 'joi'

const create = Joi.object({
    title: Joi.string().required().min(2).max(30).trim(),
    description: Joi.string().max(200),
    logo: Joi.string().required(),
})

export default {
    create,
}
