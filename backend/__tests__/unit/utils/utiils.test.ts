import { describe, expect, it } from '@jest/globals';
import { StatusCodes as STATUS_CODES, getReasonPhrase } from 'http-status-codes';
import { 
  createHTTPError,
  extractErrorMessage,
  sanitizeUserAndFormat
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


  describe('Test 3: sanitizeUserAndFormat', () => {
    const user = {
      _id: '6782840babd4d39bb35fca51',
      username: 'Ram',
      fullName: 'Ram',
      email: 'ram@gmail.com',
      password: 'ram!@#$',
      followers: [],
      following: [],
      profileImgURL: 'https://example.com',
      coverImgURL: 'https://example.com',
      bio: 'Nothing',
      link: 'https://example.com'
    };

    const errorMessage = 'The provided user data is invalid and cannot be formatted or sanitized.';

    it ('should throw an error with invalid user data', () => {
      expect(() => sanitizeUserAndFormat(100)).toThrow(errorMessage);
      expect(() => sanitizeUserAndFormat('')).toThrow(errorMessage);
      expect(() => sanitizeUserAndFormat([10, 20])).toThrow(errorMessage);
    });

    it ('should throw an error with missing required fields', () => {
      const invalidUserData = { username: 'Ram' };
      expect(() => sanitizeUserAndFormat(invalidUserData)).toThrow(errorMessage);
    });

    it ('should return valid sanitize and formatted user data.', () => {
      const sanitizedUser = sanitizeUserAndFormat(user);
      expect(sanitizedUser).toBeDefined();
      expect(sanitizedUser).not.toBeNull();
      expect(typeof sanitizedUser).toBe('object');

      const { password:_, ...rest } = user;
      expect(sanitizedUser).toEqual(rest); 
    });
  });
});
