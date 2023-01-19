import List, { ListInterface } from '@/models/List.model'
import Board from '@/models/Board.model'
import CustomError from '@/errors/index'
import cardService from './card.service'
import Card from '@/models/Card.model'

async function create(boardId: string, { title, cards }: ListInterface) {
    let board = await Board.findOne({ _id: boardId })
    if (!board) {
        throw new CustomError.BadRequestError(
            `Board with id ${boardId} does not exist`
        )
    }
    const list = await List.create({ title, boardId, cards })
    board.lists.push(String(list._id))
    await board.save()
    return list
}

async function getList(listId: string) {
    const list = await List.findOne({ _id: listId })
    return list
}

async function getBoardLists(boardId: string) {
    const board = await Board.findOne({ _id: boardId }).populate({
        path: 'lists',
    })
    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }

    const lists = board.lists
    return lists
}

async function updateList(listId: string, { title, cards }: ListInterface) {
    const list = await List.findOneAndUpdate(
        { _id: listId },
        {
            title,
            $set: {
                cards: cards,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    )

    if (!list) {
        throw new CustomError.NotFoundError(
            `List with id ${listId} does not exist`
        )
    }
    // if (list.cards) {
    //     list.cards.forEach(async (cardId) => {
    //         await Card.findOneAndUpdate({ _id: cardId }, { listId })
    //     })
    // }
    return list
}

async function deleteList(boardId: string, listId: string) {
    // delete listId in board.lists
    const board = await Board.findOneAndUpdate(
        { _id: boardId },
        { $pull: { lists: listId } },
        { new: true }
    )

    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }

    // delete card documents in list.cards
    const list = await List.findOne({ _id: listId })
    if (!list) {
        throw new CustomError.NotFoundError(
            `List with id ${listId} does not exist`
        )
    }

    await Card.deleteMany({ _id: list.cards })

    // delete list document
    await list.deleteOne()
}

export default {
    create,
    getBoardLists,
    getList,
    updateList,
    deleteList,
}
