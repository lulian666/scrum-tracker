import { Request } from 'express'
import { tokenUserInterface } from '@/utils/creatTokenUser.util'

export interface authInfoRequest extends Request {
    user?: tokenUserInterface
}
