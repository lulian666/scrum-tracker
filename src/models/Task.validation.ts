import Joi from 'joi'

const create = Joi.object({
    title: Joi.string().required().min(2).max(40).trim(),
    description: Joi.string().max(400),
    assignTo: Joi.string(),
    status: Joi.string().valid('open', 'resolved', 'invalid', 'wontfix'),
    priority: Joi.string().valid('high', 'normal', 'low'),
    board: Joi.string().required(),
})

export default {
    create,
}
