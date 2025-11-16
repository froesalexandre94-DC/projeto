export default {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { configFile: "./babel-jest.config.cjs" }],
  },
  extensionsToTreatAsEsm: [],
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
