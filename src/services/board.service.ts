import Board, { BoardInterface } from '@/models/Board.model'
import User from '@/models/User.model'
import CustomError from '@/errors/index'
import List from '@/models/List.model'
import listService from './list.service'
import Card from '@/models/Card.model'

async function create({
    title,
    description,
    icon,
    members,
    manager,
    lists,
}: BoardInterface) {
    let board = await Board.create({
        title,
        description,
        icon,
        members,
        manager,
        lists,
    })
    await board.populate({
        path: 'lists',
        select: 'id cards',
    })
    return board
}

async function getUserBoards(userId: String) {
    // todo find should have query '{ manager: userId }
    const boards = await Board.find()
        .populate({
            path: 'lists',
            select: 'id cards',
        })
        .populate({
            path: 'members',
            select: 'id name',
        })
    return boards
}

async function getSingleBoard(boardId: String) {
    const board = await Board.findOne({ _id: boardId }).populate({
        path: 'lists',
        select: 'id cards',
    })

    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }
    return board
}

async function updateBoard(boardId: string, updateData: any) {
    let board = await Board.findOne({ _id: boardId })
    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }

    if (updateData.lists) {
        // first we need to update list objects
        updateData.lists.forEach(async (list: { id: any; cards: any }) => {
            await List.findOneAndUpdate(
                { _id: list.id },
                { $set: { cards: list.cards } }
            )
        })

        // then we update board object
        const listIds = updateData.lists.map((item: { id: any }) => item.id)
        updateData.lists = listIds
    }

    board = await Board.findOneAndUpdate({ _id: boardId }, updateData, {
        new: true,
        runValidators: true,
    }).populate({
        path: 'lists',
        select: 'id cards',
    })

    return board
}

async function deleteBoard(boardId: String) {
    // delete board means also delete lists and cards in it
    const board = await Board.findOne({ _id: boardId }).populate({
        path: 'lists',
        select: 'id cards',
    })
    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }
    const lists = board.lists
    lists.forEach(async (list) => {
        await Card.deleteMany({ _id: Object(list).cards })
    })
    await board.delete()
}

async function getBoardMembers(boardId: String) {
    const board = await Board.findOne({ _id: boardId })
    if (!board) {
        throw new CustomError.NotFoundError(
            `Board with id ${boardId} does not exist`
        )
    }
    const members: String[] = board.members
    const users = User.find({ _id: members }).select('id name')
    return users
}

export default {
    create,
    getUserBoards,
    getSingleBoard,
    updateBoard,
    deleteBoard,
    getBoardMembers,
}
