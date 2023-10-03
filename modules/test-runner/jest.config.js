module.exports = {
  roots: ['<rootDir>/../'],
  moduleFileExtensions: ['ts', 'tsx', 'ts', 'js'],
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
