/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@helper/(.*)$': '<rootDir>/src/helper/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
  },
};

