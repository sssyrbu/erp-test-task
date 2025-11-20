import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFiles: ['<rootDir>/tests/setEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts']
};

export default config;

