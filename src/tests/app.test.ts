import supertest from 'supertest'
import app from '../app'

describe('Test the root path', () => {
    it('should response the GET method', async () => {
        await supertest(app).get('/').expect(200)
    })
})

