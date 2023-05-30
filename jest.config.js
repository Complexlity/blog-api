/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  // clearMocks: true,
};
