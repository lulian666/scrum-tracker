import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import boardService from '@/services/board.service'
import userBoardSubscriptionService from '@/services/UserBoardSubscription.service'

const createBoard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { title, description, icon } = req.body
    const managerId = req.user!.uuid
    const board = await boardService.createBoard({
        title,
        description,
        icon,
        lists: [],
        members: [managerId],
        manager: managerId,
    })

    // create UserBoardSubscription
    const userBoardSubscription = await userBoardSubscriptionService.create(
        req.user!.userId,
        board.id
    )

    let customBoard: any = board.toObject()
    customBoard['settings'] = { subscribed: userBoardSubscription.subscription }

    res.status(StatusCodes.CREATED).json({ board: customBoard })
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

    // find out if user has subscribed this board
    const userBoardSubscription = await userBoardSubscriptionService.getOne(
        req.user!.userId,
        boardId
    )

    let customBoard: any = board!.toObject()
    customBoard['settings'] = {
        subscribed: userBoardSubscription!.subscription,
    }

    res.status(StatusCodes.OK).json({ board: customBoard })
}

const getSingleBoard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId } = req.params
    const board = await boardService.getSingleBoard(boardId)

    // find out if user has subscribed this board
    const userBoardSubscription = await userBoardSubscriptionService.getOne(
        req.user!.userId,
        boardId
    )

    let customBoard: any = board.toObject()
    customBoard['settings'] = {
        subscribed: userBoardSubscription!.subscription,
    }

    res.status(StatusCodes.OK).json({ board: customBoard })
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

const updateSubscription = async (req: authInfoRequest, res: Response) => {
    const { subscription } = req.body
    const { userId } = req.user!
    const { boardId } = req.params

    const userBoardSubscription = await userBoardSubscriptionService.updateOne(
        userId,
        boardId,
        subscription
    )
    res.status(StatusCodes.OK).json({ userBoardSubscription })
}

export default {
    createBoard,
    getAllBoards,
    getUserBoards,
    updateBoard,
    getSingleBoard,
    deleteBoard,
    getBoardMembers,
    updateSubscription,
}
