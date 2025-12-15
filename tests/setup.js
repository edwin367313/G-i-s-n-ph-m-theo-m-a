// Test setup file for Jest
require('dotenv').config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(30000);

// Mock console to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Before all tests
beforeAll(async () => {
  // Setup test database connection
  console.log('Setting up test environment...');
});

// After all tests
afterAll(async () => {
  // Close database connections
  console.log('Cleaning up test environment...');
});

// Before each test
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
});
