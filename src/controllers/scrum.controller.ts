import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import scrumService from '@/services/scrum.service'

const createScrum = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    // const imageFile = req.files!.image as UploadedFile
    // const { secure_url } = await uploadsService.uploadScrumLogo(imageFile)
    const { name, description, logo } = req.body
    const managerId = req.user!.userId
    const scrum = await scrumService.create({
        name,
        description,
        logo,
        members: [managerId],
        manager: managerId,
    })

    res.status(StatusCodes.CREATED).json({ scrum })
}

const getAllScrums = async (req: Request, res: Response): Promise<void> => {
    res.send('getAllScrums')
}

const getUserScrums = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const { userId } = req.user!
    const scrums = await scrumService.getUserScrums(userId)
    res.status(StatusCodes.OK).json({
        scrums,
        count: Array(scrums).length,
    })
}

const updateScrum = async (req: Request, res: Response): Promise<void> => {
    res.send('updateScrum')
}

const getSingleScrum = async (req: Request, res: Response): Promise<void> => {
    res.send('getSingleScrum')
}

const deleteScrum = async (req: Request, res: Response): Promise<void> => {
    res.send('deleteScrum')
}

export default {
    createScrum,
    getAllScrums,
    getUserScrums,
    updateScrum,
    getSingleScrum,
    deleteScrum,
}
