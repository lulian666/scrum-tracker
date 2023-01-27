import Card, { CardInterface } from '@/models/Card.model'
import List from '@/models/List.model'
import Board from '@/models/Board.model'
import CustomError from '@/errors/index'
import eventEmitter from '@/subscribers/notification.subscriber'
import Activity from '@/models/Activity.model'

async function createCard(
    boardId: string,
    listId: string,
    userId: string,
    {
        title,
        name,
        description,
        attachments = [],
        activities = [],
    }: CardInterface
) {
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
        attachments,
        activities,
    })
    list.cards.push(String(card._id))
    await list.save()

    // send notification to the group
    eventEmitter.emit('newCard', boardId, card.title, userId)

    return card
}

async function getSingleCard(cardId: string) {
    let card = await Card.findOne({ _id: cardId })
        .populate({
            path: 'activities',
            options: { sort: { createdAt: -1 } },
        })
        .populate({
            path: 'attachments',
            options: { sort: { createdAt: -1 } },
        })

    return card
}

async function getBoardCards(boardId: string) {
    const board = await Board.findOne({ _id: boardId }).populate({
        path: 'lists',
        select: 'id',
        populate: {
            path: 'cards',
            populate: [
                { path: 'activities', options: { sort: { createdAt: -1 } } },
                { path: 'attachments', options: { sort: { createdAt: -1 } } },
            ],
            options: { sort: { createdAt: -1 } },
        },
    })
    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }

    let cards: Object[] = []
    board.lists.forEach((list) => {
        const listId = Object(list).id
        // add listId and boardId
        const customeCards = Object(list).cards.map((card: any) => {
            return { ...card.toObject(), listId, boardId }
        })
        cards = cards.concat(customeCards)
    })

    return cards
}

async function updateCard(
    boardId: string,
    cardId: string,
    userId: string,
    updateData: CardInterface
) {
    //leave the activities alone since it has been add to card through comment service
    if (updateData.activities) {
        delete Object(updateData).activities
    }
    if (updateData.attachments) {
        delete Object(updateData).attachments
    }

    const card = await Card.findOneAndUpdate({ _id: cardId }, updateData, {
        new: true,
        runValidators: true,
    })
        .populate({ path: 'activities', options: { sort: { createdAt: -1 } } })
        .populate({ path: 'attachments', options: { sort: { createdAt: -1 } } })

    if (!card) {
        throw new CustomError.NotFoundError(
            `List with id ${cardId} does not exist`
        )
    }
    const list = await List.findOne({ cards: card.id })
    const listId = list?.toObject()._id
    const customCard = { ...card.toObject(), listId, boardId }

    // send notification to the group
    eventEmitter.emit('updateCard', boardId, card.title, userId)
    return customCard
}

async function deleteCard(boardId: string, cardId: string) {
    const card = await Card.findOne({ _id: cardId })
    if (!card) {
        throw new CustomError.NotFoundError(
            `Card with id ${cardId} does not exist`
        )
    }

    // delete cardId in list.cards
    const list = await List.findOneAndUpdate(
        { cards: cardId },
        {
            $pull: { cards: cardId },
        },
        { new: true }
    )

    // delete activity and attachments
    const activities = await Activity.deleteMany({ _id: card.activities })

    // delete card document
    await card.deleteOne()
    return card
}

export default {
    createCard,
    getSingleCard,
    getBoardCards,
    updateCard,
    deleteCard,
}
