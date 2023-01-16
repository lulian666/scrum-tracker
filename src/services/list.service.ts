import List, { ListInterface } from '@/models/List.model'
import Board from '@/models/Board.model'
import CustomError from '@/errors/index'

async function create({ title, boardId, cards }: ListInterface) {
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

async function getList(listId: String) {
    const list = await List.findOne({ _id: listId })
    return list
}

async function getBoardLists(boardId: String) {
    const board = Board.findOne({ _id: boardId })
    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }
    const lists = List.find({ boardId })
    return lists
}

export default {
    create,
    getBoardLists,
    getList,
}
