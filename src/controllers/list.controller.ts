import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import listService from '@/services/list.service'

const createList = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { title, board } = req.body
    const list = await listService.create({ title, board })

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
    const id = req.params.id
    const lists = await listService.getBoardLists(id)

    let listsForFE: Object[] = []
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
    createList,
    getBoardLists,
    getList,
}
