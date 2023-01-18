import { Request } from 'express'
import { SafeUserInterface } from '@/utils/creatTokenUser.util'

export interface authInfoRequest extends Request {
    user?: SafeUserInterface
}
