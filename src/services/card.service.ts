import Card, { CardInterface } from '@/models/Card.model'
import List from '@/models/List.model'
import CustomError from '@/errors/index'

async function create({
    title,
    name,
    description,
    boardId,
    listId,
    createdBy,
    assignTo,
    attachments = [],
    priority = 'normal',
}: CardInterface) {
    let list = await List.findOne({ _id: listId })
    if (!list) {
        throw new CustomError.NotFoundError(
            `List with id ${listId} does not exist`
        )
    }
    const card = await Card.create({
        title,
        name,
        description,
        boardId,
        listId,
        createdBy,
        assignTo,
        attachments,
        priority,
    })
    list.cards.push(String(card._id))
    await list.save()
    return card
}

async function getSingleCard(cardId: String) {
    const card = Card.findOne({ _id: cardId })
    return card
}

async function getBoardCards(boardId: String) {
    const cards = Card.find({ boardId })
    return cards
}

export default {
    create,
    getSingleCard,
    getBoardCards,
}
