const Object_freeze = Object.freeze;

const ErrorCodes = Object_freeze({
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
});

const ErrorMessages = Object_freeze({
  [ErrorCodes.UNAUTHORIZED]: 'Authentication required.',
  [ErrorCodes.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ErrorCodes.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCodes.VALIDATION_ERROR]: 'Invalid input data.',
  [ErrorCodes.INTERNAL_ERROR]: 'An unexpected error occurred.',
  [ErrorCodes.BAD_REQUEST]: 'Bad request.',
  [ErrorCodes.CONFLICT]: 'Resource conflict.',
});

module.exports = {
  ErrorCodes,
  ErrorMessages
};
