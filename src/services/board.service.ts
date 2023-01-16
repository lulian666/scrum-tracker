import Board, { BoardInterface } from '@/models/Board.model'
import User from '@/models/User.model'
import CustomError from '@/errors/index'
import List from '@/models/List.model'

async function create({
    title,
    description,
    logo,
    members,
    manager,
}: BoardInterface) {
    const board = Board.create({ title, description, logo, members, manager })
    return board
}

async function getUserBoards(userId: String) {
    const boards = Board.find().populate({
        path: 'members',
        match: { _id: userId },
        select: 'name _id',
    })
    return boards
}

async function getSingleBoard(boardId: String) {
    const board = Board.findOne({ _id: boardId })
    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }
    return board
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

export default { create, getUserBoards, getSingleBoard, getBoardLists }
