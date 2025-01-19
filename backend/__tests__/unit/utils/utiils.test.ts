import { describe, expect, it } from '@jest/globals';
import { StatusCodes as STATUS_CODES, getReasonPhrase } from 'http-status-codes';
import { 
  createHTTPError,
  extractErrorMessage,
} from '../../../src/lib/utils/common';


describe('Utility Functions Tests', () => {

  describe('Test 1: createHTTPError', () => {      
    const statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = getReasonPhrase(STATUS_CODES.INTERNAL_SERVER_ERROR);

    it('should return a valid http error object', () => {
      const error = createHTTPError(statusCode, message);
      expect(error).not.toBeNull();
      expect(error.statusCode).toBe(statusCode);
      expect(error.message).toBe(message);
    });

    it('should handle missing arguments gracefully', () => {
      const error = createHTTPError();
      expect(error).not.toBeNull();
      expect(error.statusCode).toBe(statusCode);
      expect(error.message).toBe(message);
    });
  });


  describe('Test 2: extractErrorMessage', () => {
    it ('should return a valid error message', () => {
      const error = new Error('Invalid');
      const message = extractErrorMessage(error);

      expect(message).toBeDefined();
      expect(message).not.toBeNull();
      expect(message).toBe('Invalid');
    });

    it ('should convert other data type to string message', () => {
      const error = 400;
      const message = extractErrorMessage(error);

      expect(message).toBeDefined();
      expect(message).not.toBeNull();
      expect(message).toBe('400');
    });
  });
});
