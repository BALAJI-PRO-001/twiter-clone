import { HTTPError } from '../types';

import { 
  StatusCodes as STATUS_CODES, 
  getReasonPhrase 
} from 'http-status-codes';


export function extractErrorMessage(error: Error | any): string {
  return error instanceof Error ? error.message : String(error);
}



export function createHTTPError(
  statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
  message: string = getReasonPhrase(STATUS_CODES.INTERNAL_SERVER_ERROR)  
): HTTPError {
  const error = new Error(message) as HTTPError;
  error.statusCode = statusCode;
  return error;
}
