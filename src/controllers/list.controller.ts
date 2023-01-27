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
    const list = await listService.createList(boardId, { title, cards: [] })
    const listForFE = { ...list.toObject(), boardId }
    res.status(StatusCodes.CREATED).json({ list: listForFE })
}

const getList = async (req: authInfoRequest, res: Response): Promise<void> => {
    const { boardId, listId } = req.params
    const list = await listService.getSingleList(listId)

    const listForFE = { ...list?.toObject(), boardId }

    res.status(StatusCodes.OK).json({ list: listForFE })
}

const getBoardLists = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId } = req.params
    let lists = await listService.getBoardLists(boardId)
    lists = lists.map((list: any) => {
        return { ...list.toObject(), boardId }
    })
    res.status(StatusCodes.OK).json({ lists })
}

const updateList = async (req: authInfoRequest, res: Response) => {
    const { boardId, listId } = req.params
    const { title, cards } = req.body
    const list = await listService.updateList(listId, { title, cards })
    const listForFE = { ...list.toObject(), boardId }
    res.status(StatusCodes.OK).json({ list: listForFE })
}

const deleteList = async (req: authInfoRequest, res: Response) => {
    const { boardId, listId } = req.params
    await listService.deleteList(boardId, listId)
    res.status(StatusCodes.OK).json({})
}

export default {
    createList,
    getBoardLists,
    getList,
    updateList,
    deleteList,
}
