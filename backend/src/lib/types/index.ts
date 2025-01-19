export interface HTTPError extends Error {
  statusCode: number;
  message: string;
}

export interface FormattedDataValidationError {
  field: string;
  location: string;
  providedValue: string;
  message: string; 
}

export interface ValidationResult {
  isValid: boolean;
  value: any;
}


export interface RequiredFieldsValidationResult {
  isValid?: boolean;
  location?: string;
  messages?: string[];
}


declare global {
  namespace Express {
    interface Request {
      verifiedUserId?: string
    }
  }
}
