export interface HTTPError extends Error {
  statusCode: number;
  message: string;
}


export interface FormattedUserDataValidationError {
  isValid: boolean;
  field: string;
  validationLocation: string;
  providedValue: string;
  errorMessages: string[];
}

