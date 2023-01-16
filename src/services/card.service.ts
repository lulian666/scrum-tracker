import Card, { CardInterface } from '@/models/Card.model'
import CustomError from '@/errors/custom.error'

// async function create({
//     title,
//     description,
//     createdBy,
//     assignTo,
//     attachments,
//     status,
//     priority,
//     board,
// }: CardInterface) {
//     const card = await Card.create({
//         title,
//         description,
//         createdBy,
//         assignTo,
//         attachments,
//         status,
//         priority,
//         board,
//     })
//     return card
// }

async function getSingleCard(cardId: String) {
    const card = Card.findOne({ _id: cardId })
    return card
}

async function getBoardCards(boardId: String) {
    const cards = Card.find({ boardId })
    return cards
}

export default {
    // create,
    getSingleCard,
    getBoardCards,
}
