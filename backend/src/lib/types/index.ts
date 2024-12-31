export interface HTTPError extends Error {
  statusCode: number;
  message: string;
}

export interface FormattedUserDataValidationError {
  field: string;
  validationLocation: string;
  providedValue: string;
  errorMessages: string[];
}

export interface ValidationResult {
  isValid: boolean;
  value: any;
}