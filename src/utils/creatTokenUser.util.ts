import { UserInterface } from '@/models/User.model'

export interface tokenUserInterface {
    userId: string
    name: string
    role: string
}

const createTokenUser = (user: UserInterface): tokenUserInterface => {
    return { userId: user._id, name: user.name, role: user.role }
}

export default createTokenUser