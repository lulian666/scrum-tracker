import CustomError from '@/errors/index'
import boardService from '@/services/board.service'
import Board from '@/models/Board.model'
import { Document } from 'mongoose'

const mockingoose = require('mockingoose')

const boardRequest = {
    title: 'test',
    description:
        'Get basics done so I can create scrums and tasks to track my progress',
    icon: 'heroicons-outline:template',
    members: ['63b8eece76774b831b4b5c03'],
    manager: '63b8eece76774b831b4b5c03',
    lists: ['63ce2916fd55a35fdb45e650'],
}

const boardResponse = {
    icon: 'heroicons-outline:template',
    title: 'test',
    description:
        'Get basics done so I can create scrums and tasks to track my progress',
    members: ['63b8eece76774b831b4b5c03'],
    manager: '63b8eece76774b831b4b5c03',
    lists: ['63ce2916fd55a35fdb45e650'],
    _id: '63cfb9c135c8b262ab6bc6d5',
    createdAt: '2023-01-24T10:58:09.083Z',
    updatedAt: '2023-01-24T10:58:09.083Z',
    id: '63cfb9c135c8b262ab6bc6d5',
    populte: () => {},
}
describe('Test board service', () => {
    beforeEach(async () => {
        jest.clearAllMocks()
    })

    describe.only('test create service', () => {
        it('should populate lists', async () => {
            mockingoose(Board).toReturn(boardResponse, 'create')

            // const result = await boardService.createBoard(boardRequest)
            // const mockPopulate = jest.spyOn(boardResponse, 'populate')
            // expect(mockPopulate).toHaveBeenCalled()
            // expect(result).toMatchObject({
            //     icon: 'heroicons-outline:template',
            //     title: 'test',
            //     description:
            //         'Get basics done so I can create scrums and tasks to track my progress',
            //     members: ['63b8eece76774b831b4b5c03'],
            //     manager: '63b8eece76774b831b4b5c03',
            //     lists: [
            //         {
            //             cards: [
            //                 '63cf6d4c6006d4f491138017',
            //                 '63cf3dbd7f0ef610a07a34ae',
            //                 '63ce986fd1e227ee7dc6af01',
            //                 '63ce93e9f4b22b2c726cf30e',
            //                 '63ce91cff4b22b2c726cf2be',
            //                 '63ce8ad0f4b22b2c726cf15f',
            //                 '63ce8af7f4b22b2c726cf163',
            //                 '63ce8016514d2e766a4bb3d7',
            //                 '63ce8002514d2e766a4bb3d3',
            //                 '63ce2903fd55a35fdb45e648',
            //                 '63ce292bfd55a35fdb45e654',
            //                 '63ce7fdc514d2e766a4bb3c2',
            //             ],
            //             id: '63ce2916fd55a35fdb45e650',
            //         },
            //     ],
            //     _id: '63cfb9c135c8b262ab6bc6d5',
            //     createdAt: '2023-01-24T10:58:09.083Z',
            //     updatedAt: '2023-01-24T10:58:09.083Z',
            //     id: '63cfb9c135c8b262ab6bc6d5',
            // })
        })
    })
})
