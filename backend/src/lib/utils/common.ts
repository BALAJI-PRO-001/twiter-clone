type errorObj = Error | any;

export function extractErrorMessage(error: errorObj) {
  return error instanceof Error ? error.message : String(error);
}