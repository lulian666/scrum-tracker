import supertest from 'supertest'
import app from '../app'
import authController from '@/controllers/auth.controller'
import authService from '@/services/auth.service'
// import { MongoMemoryServer } from 'mongodb-memory-server'
// import mongoose from 'mongoose'
// import mockingoose from 'mockingoose'
import User from '@/models/User.model'

const mockingoose = require('mockingoose')

// const { MongoClient } = require('mongodb')

// //@ts-ignore
// let connection
// //@ts-ignore
// let db

const userRequest = {
    name: 'dj5',
    password: 'password',
    email: 'dj5@icloud.com',
    role: 'user',
    verificationToken: 'fake token',
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
    it('should call auth service register', async () => {
        const registerServiceMock = jest
            .spyOn(authService, 'register')
            //@ts-ignore
            .mockReturnValue()
        const req = {
            body: userRequest,
        }
        const res = {
            json: () => res,
            status: () => res,
        }

        //@ts-ignore
        await authController.register(req, res)
        expect(registerServiceMock).toHaveBeenCalled()
    })
})

describe('Test auth service register', () => {
    // beforeAll(async () => {
    //     // const mongoServer = await MongoMemoryServer.create()
    //     // await mongoose.set('strictQuery', false).connect(mongoServer.getUri())
    //     //@ts-ignore
    //     connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     })
    //     //@ts-ignore
    //     db = await connection.db(globalThis.__MONGO_DB_NAME__)
    // })

    // afterAll(async () => {
    //     // await mongoose.disconnect()
    //     // await mongoose.connection.close()
    //     //@ts-ignore
    //     await connection.close()
    // })

    describe('given user has not regitered', () => {
        it('should create user and send verification email', async () => {
            const { statusCode, body } = await supertest(app)
                .post('/api/v1/auth/register')
                .send(userRequest)
            expect(statusCode).toBe(201)
            expect(body).toEqual({
                message: 'Please check your email for verification',
            })
        })
    })
    describe('given user has already regitered', () => {
        describe('given email has not been verified', () => {
            it('should update user token and resend email', async () => {
                // mockingoose(User).toReturn(userResponse, 'findOne')
                // mockingoose(User).toReturn(userResponse, 'findOneAndUpdate')
                // const req = {
                //     body: userRequest,
                // }
                // @ts-ignore
                // const res = await authController.register(req)
                // expect(res).toEqual(userResponse)

                // const res = await User.findOne({ email: 'dj6@icloud.com' })
                // expect(res).toEqual({ hey: 'hey' })

                // const res = await authService.register({...userRequest})
                // expect(res).toEqual(userResponse)

                const { statusCode, body } = await supertest(app)
                    .post('/api/v1/auth/register')
                    .send(userRequest)
                expect(statusCode).toBe(201)
                expect(body).toEqual({
                    message: 'Please check your email for verification',
                })
            })
        })

        describe('given email has already been verified', () => {
            it('should throw bad request error', async () => {
                // const users = db.collection('users')
                // const mockUser = userResponse
                // await users.insertOne(mockUser)

                mockingoose(User).toReturn(userResponse, 'findOne')
                mockingoose(User).toReturn(userResponse, 'findOneAndUpdate')
                const { statusCode, body } = await supertest(app)
                    .post('/api/v1/auth/register')
                    .send({ ...userRequest, email: 'dj6@icloud.com' })
                expect(statusCode).toBe(400)
                expect(body).toEqual({
                    message: 'Email already registered',
                })
            })
        })
    })
})
