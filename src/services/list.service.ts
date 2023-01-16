import List, { ListInterface } from '@/models/List.model'
import Board from '@/models/Board.model'
import CustomError from '@/errors/index'

async function create({ title, board }: ListInterface) {
    const list = await List.create({ title, board })
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
    const lists = List.find().populate({
        path: 'board',
        match: { _id: boardId },
    })
    return lists
}

export default {
    create,
    getBoardLists,
    getList,
}
