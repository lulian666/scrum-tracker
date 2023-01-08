/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    // testEnvironment: 'node',
    verbose: true,
    forceExit: true,
    testMatch: ["**/**/*.test.ts"],
    // clearMocks: true,
    moduleNameMapper: {
        '^@/middleware(.*)$': '<rootDir>/src/middleware$1',
        '^@/routes(.*)$': '<rootDir>/src/routes$1',
        '^@/services(.*)$': '<rootDir>/src/services$1',
        '^@/controllers(.*)$': '<rootDir>/src/controllers$1',
        '^@/models(.*)$': '<rootDir>/src/models$1',
        '^@/config(.*)$': '<rootDir>/src/config$1',
        '^@/subscribers(.*)$': '<rootDir>/src/subscribers$1',
        '^@/utils(.*)$': '<rootDir>/src/utils$1',
        '^@/errors(.*)$': '<rootDir>/src/errors$1',
        '^@/tests(.*)$': '<rootDir>/src/tests$1',
    },
    preset: '@shelf/jest-mongodb',
}
