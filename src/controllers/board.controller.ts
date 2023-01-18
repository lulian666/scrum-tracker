import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import boardService from '@/services/board.service'
import { object } from 'joi'

const createBoard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { title, description, icon, lists } = req.body
    const managerId = req.user!.uuid
    const board = await boardService.create({
        title,
        description,
        icon,
        lists,
        members: [managerId],
        manager: managerId,
    })

    res.status(StatusCodes.CREATED).json({ board })
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

const updateBoard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId } = req.params

    const board = await boardService.updateBoard(boardId, req.body)
    res.status(StatusCodes.OK).json({ board })
}

const getSingleBoard = async (req: Request, res: Response): Promise<void> => {
    const { boardId } = req.params
    const board = await boardService.getSingleBoard(boardId)
    res.status(StatusCodes.OK).json({ board })
}

const deleteBoard = async (req: Request, res: Response): Promise<void> => {
    const { boardId } = req.params
    await boardService.deleteBoard(boardId)
    res.status(StatusCodes.OK).json({})
}

const getBoardMembers = async (req: Request, res: Response): Promise<void> => {
    const { boardId } = req.params
    // const members = await boardService.getBoardMembers(boardId)
    const members = [
        {
            _id: '63b8eece76774b831b4b5c03',
            name: 'dj6',
            avatar: 'assets/images/avatars/female-01.jpg',
            data: {
                displayName: 'dj6',
            },
            uuid: '63b8eece76774b831b4b5c03',
            id: '63b8eece76774b831b4b5c03',
        },
    ]
    res.status(StatusCodes.OK).json({ members })
}

export default {
    createBoard,
    getAllBoards,
    getUserBoards,
    updateBoard,
    getSingleBoard,
    deleteBoard,
    getBoardMembers,
}
