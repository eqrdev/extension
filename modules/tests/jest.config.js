module.exports = {
  roots: ['<rootDir>/../../modules'],
  setupFilesAfterEnv: ['<rootDir>/.scripts/global-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
