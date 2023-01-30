import Joi from 'joi'

const create = Joi.object({
    title: Joi.string().required().max(50).trim(),
    description: Joi.string().max(400).allow(''),
})

const update = Joi.object({
    title: Joi.string().max(50).optional(),
    description: Joi.string().max(400).optional().allow(''),
    // do not restrict activities and attachment here
    // because they use different end point
})

export default {
    create,
    update,
}
