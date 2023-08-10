module.exports = {
  roots: ['<rootDir>/../../modules'],
  setupFilesAfterEnv: ['<rootDir>/.scripts/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
