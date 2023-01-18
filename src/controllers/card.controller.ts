import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import cardService from '@/services/card.service'

const createCard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId, listId } = req.params
    const { title, name, description } = req.body
    const { userId } = req.user!
    const card = await cardService.create(listId, {
        title,
        name,
        description,
        createdBy: userId,
        assignTo: userId,
        attachments: [],
        priority: 'normal',
    })
    const cardForFE = { ...card.toObject(), boardId, listId }
    res.status(StatusCodes.CREATED).send({ card: cardForFE })
}

const updateCard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId, cardId } = req.params
    const customCard = await cardService.updateCard(boardId, cardId, req.body)

    res.status(StatusCodes.OK).send({ card: customCard })
}

const getSingleCard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { cardId } = req.params
    const card = await cardService.getSingleCard(cardId)
    res.status(StatusCodes.OK).json({ card })
}

const deleteCard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId, cardId } = req.params
    await cardService.deleteCard(boardId, cardId)
    res.status(StatusCodes.OK).json({})
}

const getUserCards = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    res.send('getUserCards')
}

const getBoardCards = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { boardId } = req.params
    const cards = await cardService.getBoardCards(boardId)
    res.status(StatusCodes.OK).json({ cards })
}

export default {
    createCard,
    updateCard,
    deleteCard,
    getUserCards,
    getSingleCard,
    getBoardCards,
}
