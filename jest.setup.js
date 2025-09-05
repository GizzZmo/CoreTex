import '@testing-library/jest-dom';
import { setupConfigMocks } from './src/utils/testUtils';

// Setup config mocks for all tests
beforeAll(() => {
  setupConfigMocks();
});

// Suppress deprecation warnings from testing library (known issue)
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('ReactDOMTestUtils.act is deprecated')
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};