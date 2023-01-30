import Board, { BoardInterface } from '@/models/Board.model'
import User from '@/models/User.model'
import CustomError from '@/errors/index'
import List from '@/models/List.model'
import Card from '@/models/Card.model'

async function createBoard({
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

async function getUserBoards(userId: string) {
    const boards = await Board.find({
        members: userId,
    })
        .populate({
            path: 'lists',
            options: { sort: { createdAt: -1 } },
            select: 'id cards',
        })
        .sort({ createdAt: -1 })
    return boards
}

async function getSingleBoard(boardId: string) {
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
                // Here's a bug if cards is empty
                // { $set: { cards: list.cards } }
                { cards: list.cards }
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

async function deleteBoard(boardId: string) {
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

// get members in every scrum user can access
// just tell me who is the user
async function getBoardMembers(userId: string) {
    // get all boards user are in
    const boards = await Board.find({ members: userId })

    // get all the ids
    let ids: string[] = []
    boards.forEach((board) => {
        ids = ids.concat(board.members)
    })

    // get all members in these boards
    const members = await User.find({ _id: ids }).select('id name avatar')
    return members
}

export default {
    createBoard,
    getUserBoards,
    getSingleBoard,
    updateBoard,
    deleteBoard,
    getBoardMembers,
}
