import Joi, { string } from 'joi'

const create = Joi.object({
    icon: Joi.string().required(),
    title: Joi.string().required().min(2).max(50).trim(),
    description: Joi.string().max(200).optional().allow(''), // allow('') allow string to be empty
})

const update = Joi.object({
    icon: Joi.string().optional(), // allow field to be null
    title: Joi.string().min(2).max(50).optional(),
    describe: Joi.string().max(200).optional(),
    members: Joi.array().optional().items(Joi.string()),
    manager: Joi.string().optional(),
    lists: Joi.array().optional().items(Joi.object()),
})

export default {
    create,
    update,
}
