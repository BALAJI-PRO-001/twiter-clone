import { HTTPError } from '../types';


export function extractErrorMessage(error: Error | any) {
  return error instanceof Error ? error.message : String(error);
}



export function createHTTPError(statusCode: number, message: string): HTTPError {
  const error = new Error(message) as HTTPError;
  error.statusCode = statusCode;
  return error;
}
