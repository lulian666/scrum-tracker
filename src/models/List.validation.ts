import Joi from 'joi'

const create = Joi.object({
    title: Joi.string().max(20).required(),
    cards: Joi.array().items(Joi.string()).optional,
})

const update = Joi.object({
    title: Joi.string().max(20).optional(),
    cards: Joi.array().items(Joi.string()).optional,
})

export default {
    create,
    update,
}
