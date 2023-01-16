import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import boardService from '@/services/board.service'
import { object } from 'joi'

const createBoard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    // const { title, description, logo } = req.body
    // const managerId = req.user!.userId
    // const board = await boardService.create({
    //     title,
    //     description,
    //     logo,
    //     members: [managerId],
    //     manager: managerId,
    // })

    // res.status(StatusCodes.CREATED).json({ board })
    res.send('createBoard')
}

const getAllBoards = async (req: Request, res: Response): Promise<void> => {
    res.send('getAllBoards')
}

const getUserBoards = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { userId } = req.user!
    const boards = await boardService.getUserBoards(userId)
    res.status(StatusCodes.OK).json({
        boards,
        // count: Array(Boards).length,
    })
}

const updateBoard = async (req: Request, res: Response): Promise<void> => {
    res.send('updateBoard')
}

const getSingleBoard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const board = await boardService.getSingleBoard(id)
    res.status(StatusCodes.OK).json({ board })
}

const deleteBoard = async (req: Request, res: Response): Promise<void> => {
    res.send('deleteBoard')
}

const getBoardlists = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const id = req.params.id
    const lists = await boardService.getBoardLists(id)

    const listsForFE: Object[] = []
    lists.forEach((list) => {
        listsForFE.push({
            id: list.id,
            title: list.title,
            boardId: Object(list.board)._id,
        })
    })

    res.status(StatusCodes.OK).json({ lists: listsForFE })
}

export default {
    createBoard,
    getAllBoards,
    getUserBoards,
    updateBoard,
    getSingleBoard,
    deleteBoard,
    getBoardlists,
}
