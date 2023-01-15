import Scrum, { ScrumInterface } from '@/models/Scrum.model'
import User from '@/models/User.model'
import CustomError from '@/errors/custom.error'

async function create({
    name,
    description,
    logo,
    members,
    manager,
}: ScrumInterface) {
    const scrum = Scrum.create({ name, description, logo, members, manager })
    return scrum
}

async function getUserScrums(userId: String) {
    const scrums = Scrum.find().populate({
        path: 'members',
        match: { _id: userId },
        select: 'name _id',
    })
    return scrums
}

export default { create, getUserScrums }
