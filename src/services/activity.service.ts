import CustomError from '@/errors/index'
import Activity, { ActivityInterface } from '@/models/Activity.model'
import Card, { CardInterface } from '@/models/Card.model'

async function createComment(cardId: string, data: ActivityInterface) {
    const card = await Card.findOne({ _id: cardId })
    if (!card) {
        throw new CustomError.NotFoundError(
            `List with id ${cardId} does not exist`
        )
    }

    const commentActivity = await Activity.create(data)
    card.activities.push(commentActivity.id)
    await card.save()
    return commentActivity
}

async function createAttachment(cardId: string, data: ActivityInterface) {
    const card = await Card.findOne({ _id: cardId })
    if (!card) {
        throw new CustomError.NotFoundError(
            `List with id ${cardId} does not exist`
        )
    }
    const attachmentActivity = await Activity.create(data)
    card.activities.push(attachmentActivity.id)
    card.attachments.push(attachmentActivity.id)
    await card.save()

    return attachmentActivity
}

async function deleteAttachment(
    cardId: string,
    attachmentId: string,
    userId: string
) {
    const card = await Card.findOne({ _id: cardId })
    if (!card) {
        throw new CustomError.NotFoundError(
            `List with id ${cardId} does not exist`
        )
    }

    const attachment = await Activity.findOne({ _id: attachmentId })
    if (!attachment) {
        throw new CustomError.NotFoundError(
            `Attachment with id ${attachmentId} does not exist`
        )
    }
    const attachmentName = attachment.name

    // delete attachment id in card.attachments
    await card.updateOne({ $pull: { attachments: attachmentId } })

    // delete activity
    // this will also delete activity id in card.activities which I don't want
    // await attachment.deleteOne()

    // create activity about deleting
    const deleteActivity = await Activity.create({
        type: 'image',
        idMember: userId,
        message: `deleted attachment '${attachmentName}'`,
        src: '',
        name: '',
    })

    // add delete activity to card.activities
    await card.updateOne({ $addToSet: { activities: deleteActivity.id } })
}

export default {
    createComment,
    createAttachment,
    deleteAttachment,
}
