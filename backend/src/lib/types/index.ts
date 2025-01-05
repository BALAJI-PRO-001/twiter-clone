export interface HTTPError extends Error {
  statusCode: number;
  message: string;
}

export interface FormattedUserDataValidationError {
  isValid: boolean;
  validationLocation: string;
  providedValue: string;
  errorMessages: string[];
}

export interface ValidationResult {
  isValid: boolean;
  value: any;
}


export interface RequiredFieldsValidationResult {
  isValid?: boolean;
  validationLocation?: string;
  errorMessages?: string[];
}