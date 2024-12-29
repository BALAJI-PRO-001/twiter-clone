import { HTTPError } from '../types';

export default function createHTTPError(statusCode: number, message: string): HTTPError {
  const error = new Error(message) as HTTPError;
  error.statusCode = statusCode;
  return error;
}
