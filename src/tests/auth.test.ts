import supertest from 'supertest'
import app from '../app'
// import authController from '@/controllers/auth.controller'
import authService from '@/services/auth.service'
import User from '@/models/User.model'
import Token from '@/models/Token.model'
import CustomError from '@/errors/index'
import emailEventEmitter from '@/subscribers/email.subscriber'
import utils from '../utils'
import bcrypt from 'bcrypt'

const mockingoose = require('mockingoose')

const userRequest = {
    name: 'dj6',
    password: 'password',
    email: 'dj6@icloud.com',
}

const userResponse = {
    _id: '63ba4832d872876fc4904631',
    name: 'dj6',
    password: 'password',
    email: 'dj6@icloud.com',
    role: 'user',
    verificationToken: 'fake token',
    isVerified: true,
}

// describe('insert', () => {
//     //@ts-ignore
//     let connection
//     let db

//     beforeAll(async () => {
//         //@ts-ignore
//         connection = await MongoClient.connect(global.__MONGO_URI__, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         db = await connection.db()
//     })

//     afterAll(async () => {
//         //@ts-ignore
//         await connection.close()
//     })

//     it('should insert a doc into collection', async () => {
//         //@ts-ignore
//         const users = db.collection('users')

//         const mockUser = userResponse
//         await users.insertOne(mockUser)

//         const insertedUser = await users.findOne({ email: 'dj6@icloud.com' })
//         expect(insertedUser).toEqual(mockUser)
//     })

//     it('should throw bad request error', async () => {
//         const { statusCode, body } = await supertest(app)
//             .post('/api/v1/auth/register')
//             .send(userRequest)
//         expect(statusCode).toBe(400)
//         expect(body).toEqual({
//             message: 'Email already registered',
//         })
//     })
// })

describe('Test auth contoller', () => {
    // it('should call auth service register', async () => {
    //     const registerServiceMock = jest
    //         .spyOn(authService, 'register')
    //         //@ts-ignore
    //         .mockReturnValue()
    //     const req = {
    //         body: userRequest,
    //     }
    //     const res = {
    //         json: () => res,
    //         status: () => res,
    //     }
    //     //@ts-ignore
    //     await authController.register(req, res)
    //     expect(registerServiceMock).toHaveBeenCalled()
    // })
})

describe('Test register service', () => {
    beforeEach(async () => {
        jest.clearAllMocks()
    })

    describe('given user has not regitered', () => {
        it('should create user and send verification email', async () => {
            mockingoose(User).toReturn(undefined, 'fineOne')
            mockingoose(User).toReturn(
                { ...userResponse, isVerified: false },
                'create'
            )
            // const { statusCode, body } = await supertest(app)
            //     .post('/api/v1/auth/register')
            //     .send(userRequest)
            // expect(statusCode).toBe(201)
            // expect(body).toEqual({
            //     message: 'Please check your email for verification',
            // })

            const mockEventEmitter = jest.spyOn(
                emailEventEmitter,
                'sendVerificationEmail'
            )
            const result = await authService.register({
                ...userRequest,
                role: 'user',
            })
            expect(mockEventEmitter).toHaveBeenCalled()
            expect(result).toMatchObject({
                ...userResponse,
                isVerified: false,
                verificationToken: expect.any(String),
                _id: expect.anything(),
            })
        })
    })
    describe('given user has already regitered', () => {
        describe('given email has not been verified', () => {
            it('should update user token and resend email', async () => {
                mockingoose(User).toReturn(
                    { ...userResponse, isVerified: false },
                    'findOne'
                )
                mockingoose(User).toReturn(
                    { ...userResponse, isVerified: false },
                    'findOneAndUpdate'
                )
                // const { statusCode, body } = await supertest(app)
                //     .post('/api/v1/auth/register')
                //     .send(userRequest)
                // expect(statusCode).toBe(201)
                // expect(body).toEqual({
                //     message: 'Please check your email for verification',
                // })
                const mockEventEmitter = jest.spyOn(
                    emailEventEmitter,
                    'sendVerificationEmail'
                )
                const result = await authService.register({
                    ...userRequest,
                    role: 'user',
                })
                expect(mockEventEmitter).toHaveBeenCalled()
                expect(result).toMatchObject({
                    ...userResponse,
                    isVerified: false,
                    verificationToken: expect.any(String),
                    _id: expect.anything(),
                })
            })
        })

        describe('given email has already been verified', () => {
            it('should throw bad request error', async () => {
                mockingoose(User).toReturn(userResponse, 'findOne')

                // const { statusCode, body } = await supertest(app)
                //     .post('/api/v1/auth/register')
                //     .send(userRequest)
                // // .expect(202)
                // expect(statusCode).toBe(400)
                // expect(body).toEqual({
                //     message: 'Email already registered',
                // })

                //change to test service
                try {
                    await authService.register({
                        ...userRequest,
                        role: 'user',
                    })
                } catch (e) {
                    expect(e).toBeInstanceOf(CustomError.BadRequestError)
                }
            })
        })
    })
})

const tokenResponse = {
    _id: '63baa718c9d96bb6439c4e28',

    refreshToken:
        '07c51abf4185df7e6608279cdc7e3b0c2899377c4d91b8a93f0b94ce66d6e64044d1e2e6c8182aac',
    ip: '::1',
    userAgent: 'PostmanRuntime/7.29.2',
    isValid: true,
    user: '63ba9a694a6e48b1512ad70f',
}

describe('Test login service', () => {
    beforeEach(async () => {
        jest.clearAllMocks()
    })
    describe('given the user has not registered', () => {
        it('should throw bad request', async () => {
            mockingoose(User).toReturn(undefined, 'findOne')
            // const { statusCode, body } = await supertest(app)
            //     .post('/api/v1/auth/login')
            //     .send(userRequest)
            // expect(statusCode).toBe(401)
            // expect(body).toEqual({
            //     message: 'Invalid email and password',
            // })

            //change to test service
            try {
                await authService.login({
                    ...userRequest,
                    userAgent: 'something',
                    ip: 'something',
                })
            } catch (e) {
                expect(e).toBeInstanceOf(CustomError.UnauthenticatedError)
            }
        })
    })

    describe('given the user has not verified email', () => {
        it('should throw bad request', async () => {
            mockingoose(User).toReturn(
                { ...userResponse, isVerified: false },
                'findOne'
            )
            // const { statusCode, body } = await supertest(app)
            //     .post('/api/v1/auth/login')
            //     .send(userRequest)
            // expect(statusCode).toBe(401)
            // expect(body).toEqual({
            //     message: 'Please verify your email first',
            // })

            //change to test service
            try {
                await authService.login({
                    ...userRequest,
                    userAgent: 'something',
                    ip: 'something',
                })
            } catch (e) {
                expect(e).toBeInstanceOf(CustomError.UnauthenticatedError)
            }
        })
    })

    describe('given the user token is not valid', () => {
        it('should throw bad request', async () => {
            const salt = await bcrypt.genSalt(10)
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    password: await bcrypt.hash('password', salt),
                },
                'findOne'
            )
            mockingoose(Token).toReturn(
                { ...tokenResponse, isValid: false },
                'findOne'
            )
            // const { statusCode, body } = await supertest(app)
            //     .post('/api/v1/auth/login')
            //     .send(userRequest)
            // expect(statusCode).toBe(401)
            // expect(body).toEqual({
            //     message: 'Invalid email and password',
            // })

            //change to test service
            try {
                await authService.login({
                    ...userRequest,
                    userAgent: 'something',
                    ip: 'something',
                })
            } catch (e) {
                expect(e).toBeInstanceOf(CustomError.UnauthenticatedError)
            }
        })
    })

    describe('given the email and password is valid', () => {
        describe('given token does not exit', () => {
            it('should create new token', async () => {
                const salt = await bcrypt.genSalt(10)
                mockingoose(User).toReturn(
                    {
                        ...userResponse,
                        password: await bcrypt.hash('password', salt),
                    },
                    'findOne'
                )
                mockingoose(Token).toReturn(undefined, 'findOne')
                const { tokenUser, refreshToken } = await authService.login({
                    ...userRequest,
                    userAgent: 'something',
                    ip: 'something',
                })
                expect(tokenUser).toEqual({
                    userId: expect.anything(),
                    name: 'dj6',
                    role: 'user',
                })
                expect(refreshToken).not.toEqual(
                    '07c51abf4185df7e6608279cdc7e3b0c2899377c4d91b8a93f0b94ce66d6e64044d1e2e6c8182aac'
                )
            })
        })
        describe('given token already exist', () => {
            it('should update token', async () => {
                const salt = await bcrypt.genSalt(10)
                mockingoose(User).toReturn(
                    {
                        ...userResponse,
                        password: await bcrypt.hash('password', salt),
                    },
                    'findOne'
                )
                mockingoose(Token).toReturn(
                    { ...tokenResponse, isValid: true },
                    'findOne'
                )
                const { tokenUser, refreshToken } = await authService.login({
                    ...userRequest,
                    userAgent: 'something',
                    ip: 'something',
                })
                expect(tokenUser).toEqual({
                    userId: expect.anything(),
                    name: 'dj6',
                    role: 'user',
                })
                expect(refreshToken).toBe(
                    '07c51abf4185df7e6608279cdc7e3b0c2899377c4d91b8a93f0b94ce66d6e64044d1e2e6c8182aac'
                )
            })
        })
    })

    describe('given the email and password does not match', () => {
        it('should throw bad request', async () => {
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    password:
                        '$2b$10$GS6xed2NTzxTAzVHt.OQNuzcrDMUEIapSsGPO0htCaYUMvNvidTGS',
                },
                'findOne'
            )
            try {
                await authService.login({
                    ...userRequest,
                    password: 'wrongpassword',
                    userAgent: 'something',
                    ip: 'something',
                })
            } catch (e) {
                expect(e).toBeInstanceOf(CustomError.UnauthenticatedError)
            }
        })
    })
})

const verifyRequest = {
    verificationToken: 'sametoken',
    email: 'dj6@icloud.com',
}

describe('Test verify email service', () => {
    describe('given user does not exist', () => {
        it('should throw UnauthenticatedError', async () => {
            mockingoose(User).toReturn(undefined, 'findOne')
            try {
                await authService.verifyEmail(verifyRequest)
            } catch (e) {
                expect(e).toBeInstanceOf(CustomError.UnauthenticatedError)
            }
        })
    })
    describe('given email already verified', () => {
        it('should do nothing and return user object', async () => {
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    verificationToken: 'sametoken',
                    isVerified: true,
                },
                'findOne'
            )
            const user = await authService.verifyEmail(verifyRequest)
            expect(user).toMatchObject({
                ...userResponse,
                _id: expect.anything(),
                isVerified: true,
                verificationToken: 'sametoken',
                password: expect.anything(),
            })
        })
    })

    describe('given verification and email does not match', () => {
        it('should throw UnauthenticatedError', async () => {
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    verificationToken: 'differenttoken',
                    isVerified: false,
                },
                'findOne'
            )

            try {
                await authService.verifyEmail(verifyRequest)
            } catch (e) {
                expect(e).toBeInstanceOf(CustomError.UnauthenticatedError)
            }
        })
    })

    describe('given verification and email match', () => {
        it('should update user object to verified and return user object', async () => {
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    verificationToken: 'sametoken',
                    isVerified: false,
                },
                'findOne'
            )
            const user = await authService.verifyEmail(verifyRequest)
            expect(user).toMatchObject({
                ...userResponse,
                _id: expect.anything(),
                isVerified: true,
                verificationToken: '',
                verifiedDate: expect.anything(),
                password: expect.anything(),
            })
        })
    })
})

describe('Test logout service', () => {
    afterEach(async () => {
        jest.clearAllMocks()
    })
    it('should find user token and delete', async () => {
        mockingoose(Token).toReturn(tokenResponse, 'findOneAndDelete')
        const tokenMock = jest.spyOn(Token, 'findOneAndDelete')
        await authService.logout('someid')
        expect(tokenMock).toHaveBeenCalled()
    })
})

describe('Test forgot password service', () => {
    beforeEach(async () => {
        jest.clearAllMocks()
    })
    describe('given the user does not exist', () => {
        it('should do nothing', async () => {
            mockingoose(User).toReturn(undefined, 'findOne')
            const result = await authService.forgotPassword('some email')
            expect(result).toBeUndefined()
        })
    })

    describe('given the use has not verify email from registration', () => {
        it('should no nothing', async () => {
            mockingoose(User).toReturn(
                { ...userResponse, isVerified: false },
                'findOne'
            )
            const result = await authService.forgotPassword('some email')
            expect(result).toMatchObject({
                ...userResponse,
                _id: expect.anything(),
                isVerified: false,
            })
        })
    })

    describe('given user exist and is verified', () => {
        it('should create password token and send email', async () => {
            mockingoose(User).toReturn(
                { ...userResponse, isVerified: true },
                'findOne'
            )
            const mockEventEmitter = jest.spyOn(
                emailEventEmitter,
                'sendResetPasswordEmail'
            )
            const mockHashString = jest
                .spyOn(utils, 'hashString')
                .mockReturnValue('somehash')
            const result = await authService.forgotPassword('some email')
            expect(mockEventEmitter).toHaveBeenCalled()
            expect(result).toMatchObject({
                ...userResponse,
                _id: expect.anything(),
                passwordToken: 'somehash',
                password: expect.any(String),
                passwordTokenExpirationDate: expect.any(Date),
            })
        })
    })
})

const resetRequest = {
    token: 'sametoken',
    email: 'dj6@icloud.com',
    newPassword: 'newpassword',
}

describe('Test resetPassword service', () => {
    beforeEach(async () => {
        jest.clearAllMocks()
    })

    describe('given user does not exist', () => {
        it('should do nothting', async () => {
            mockingoose(User).toReturn(undefined, 'findOne')
            const result = await authService.resetPassword(resetRequest)
            expect(result).toBeUndefined()
        })
    })

    describe('given token is wrong', () => {
        it('should do nothing to user object', async () => {
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    passwordToken: 'sametoken',
                    passwordTokenExpirationDate: new Date(
                        Date.now() + 1000 * 60 * 10
                    ),
                },
                'findOne'
            )
            const mockHashString = jest
                .spyOn(utils, 'hashString')
                .mockReturnValue('differenttoken')
            const result = await authService.resetPassword({
                ...resetRequest,
                token: 'differenttoken',
            })
            expect(result).toMatchObject({
                ...userResponse,
                _id: expect.anything(),
                passwordToken: expect.any(String),
                password: 'password',
                passwordTokenExpirationDate: expect.any(Date),
            })
        })
    })

    describe('given token has expired', () => {
        it('should do nothing to user object', async () => {
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    passwordToken: 'sametoken',
                    passwordTokenExpirationDate: new Date(
                        Date.now() - 1000 * 60 * 10
                    ),
                },
                'findOne'
            )
            const mockHashString = jest
                .spyOn(utils, 'hashString')
                .mockReturnValue('sametoken')

            const result = await authService.resetPassword({
                ...resetRequest,
                token: 'sametoken',
            })
            expect(result).toMatchObject({
                ...userResponse,
                _id: expect.anything(),
                passwordToken: expect.any(String),
                password: 'password',
                passwordTokenExpirationDate: expect.any(Date),
            })
        })
    })

    describe('given token is right and has expired', () => {
        it('should change password and remove password token', async () => {
            mockingoose(User).toReturn(
                {
                    ...userResponse,
                    passwordToken: 'sametoken',
                    passwordTokenExpirationDate: new Date(
                        Date.now() + 1000 * 60 * 10
                    ),
                },
                'findOne'
            )
            const mockHashString = jest
                .spyOn(utils, 'hashString')
                .mockReturnValue('sametoken')
            const result = await authService.resetPassword({
                ...resetRequest,
                token: 'sametoken',
            })

            expect(mockHashString).toHaveBeenCalled()

            expect(result).toMatchObject({
                ...userResponse,
                _id: expect.anything(),
                passwordToken: '',
                // password: 'newpassword',
                password: expect.any(String),
                passwordTokenExpirationDate: expect.any(Date),
            })
        })
    })
})
