import supertest from 'supertest'
import app from '../app'
import authController from '@/controllers/auth.controller'
import authService from '@/services/auth.service'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

const user = {
    name: 'dj6',
    password: 'password',
    email: 'dj6@icloud.com',
    role: 'user',
    verificationToken: 'fake token',
}

describe('Test auth contoller', () => {
    it('should call auth service register', async () => {
        const registerServiceMock = jest
            .spyOn(authService, 'register')
            //@ts-ignore
            .mockReturnValue()
        const req = {
            body: user,
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
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await mongoose.set('strictQuery', false).connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe('given user has not regitered', () => {
        it('should create user and send verification email', async () => {
            const { statusCode, body } = await supertest(app)
                .post('/api/v1/auth/register')
                .send(user)
            expect(statusCode).toBe(201)
            expect(body).toEqual({
                message: 'Please check your email for verification',
            })
        })

        describe('given user has already regitered', () => {
            describe('given email has not been verified', () => {
                // it('should update user token and resend email', async () => {
                //     const {statusCode, body} = await supertest(app).post('api/v1/auth/register').send(user)
                //     expect(statusCode).toBe(200)
                // })
            })

            describe('given email has already been verified', () => {})
        })
    })
})
