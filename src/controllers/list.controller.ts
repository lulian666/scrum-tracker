import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import listService from '@/services/list.service'

const createList = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId } = req.params
    const { title } = req.body
    const list = await listService.create({ title, boardId, cards: [] })

    res.status(StatusCodes.CREATED).json({ list })
}

const getList = async (req: authInfoRequest, res: Response): Promise<void> => {
    const { boardId, listId } = req.params
    const list = await listService.getList(listId)

    const listForFE = { ...list, boardId }

    res.status(StatusCodes.OK).json({ list: listForFE })
}

const getBoardLists = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId } = req.params
    const lists = await listService.getBoardLists(boardId)

    res.status(StatusCodes.OK).json({ lists })
}

export default {
    createList,
    getBoardLists,
    getList,
}
