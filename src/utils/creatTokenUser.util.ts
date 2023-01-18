import { UserInterface } from '@/models/User.model'

//deprecated
interface tokenUserInterface {
    userId: string
    name: string
    role: string
}

const createTokenUser = (user: UserInterface): tokenUserInterface => {
    return { userId: user._id, name: user.name, role: user.role }
}

export interface SafeUserInterface {
    uuid: string
    userId: string
    from: string
    role: string
    data: object
}

const createSafeUser = (user: UserInterface): SafeUserInterface => {
    return {
        uuid: user._id,
        userId: user._id,
        from: user.from,
        role: user.role,
        data: {
            displayName: user.name,
            email: user.email,
        },
    }
}

export default createSafeUser
