import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authInfoRequest } from './request.definition'
import taskService from '@/services/task.service'

const createTask = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    const {
        title,
        description,
        assignTo,
        attachments,
        priority,
        board,
        status,
    } = req.body
    const { userId } = req.user!
    const task = await taskService.create({
        title,
        description,
        createdBy: userId,
        assignTo,
        attachments,
        status: status || 'open',
        priority: priority || 'normal',
        board,
    })
    res.status(StatusCodes.CREATED).send({ task })
}

const updatedTask = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    res.send('updatedTask')
}

const getSingleTask = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    res.send('getSingleTask')
}

const deleteTask = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    res.send('deleteTask')
}

const getUserTasks = async (
    req: authInfoRequest,
    res: Response
): Promise<void> => {
    res.send('getUserTasks')
}

export default {
    createTask,
    updatedTask,
    deleteTask,
    getUserTasks,
    getSingleTask,
}
