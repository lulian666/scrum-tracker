import Task, { TaskInterface } from '@/models/Task.model'
import CustomError from '@/errors/custom.error'

async function create({
    title,
    description,
    createdBy,
    assignTo,
    attachments,
    status,
    priority,
    board,
}: any) {
    const task = await Task.create({
        title,
        description,
        createdBy,
        assignTo,
        attachments,
        status,
        priority,
        board,
    })
    return task
}

export default {
    create,
}
