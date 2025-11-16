export default {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { configFile: "./babel-jest.config.cjs" }],
  },
  extensionsToTreatAsEsm: [],
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/lib/$1",
    "^@/(.*)$": "<rootDir>/$1"   // se você usar alias @/ também
  },
};
