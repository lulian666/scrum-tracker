import CustomError from '@/errors/index'
import Activity, { ActivityInterface } from '@/models/Activity.model'
import Card, { CardInterface } from '@/models/Card.model'

async function createComment(cardId: string, data: ActivityInterface) {
    const card = await Card.findOne({ _id: cardId })
    if (!card) {
        throw new CustomError.NotFoundError(
            `List with id ${card} does not exist`
        )
    }

    const commentActivity = await Activity.create(data)
    card.activities.push(commentActivity.id)
    await card.save()
    return commentActivity
}
export default {
    createComment,
}
