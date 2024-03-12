interface ValidationError extends Error {
  errors: Record<string, unknown>;
}
function isValidationError(error: unknown): error is ValidationError {
  return (error as ValidationError).errors !== undefined;
}

interface MongoError extends Error {
  code?: number;
}

function isMongoError(error: unknown): error is MongoError {
  return (error as MongoError).code !== undefined;
}

export { ValidationError, isValidationError, MongoError, isMongoError };
