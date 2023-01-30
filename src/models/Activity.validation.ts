import Joi from 'joi'

const createComment = Joi.object({
    type: Joi.string().allow('image', 'comment').required(),
    idMember: Joi.string().required(),
    message: Joi.string().max(100).required(),
})

export default {
    createComment,
}
