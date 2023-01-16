import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import cardService from '@/services/card.service'

const createCard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    // const {
    //     title,
    //     description,
    //     assignTo,
    //     attachments,
    //     priority,
    //     board,
    //     status,
    // } = req.body
    // const { userId } = req.user!
    // const card = await cardService.create({
    //     title,
    //     description,
    //     createdBy: userId,
    //     assignTo,
    //     attachments,
    //     status: status || 'open',
    //     priority: priority || 'normal',
    //     board,
    // })
    // res.status(StatusCodes.CREATED).send({ card })
    res.send('createCard')
}

const updatedCard = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    res.send('updatedCard')
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
    res.send('deleteCard')
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
    updatedCard,
    deleteCard,
    getUserCards,
    getSingleCard,
    getBoardCards,
}
