import { Prisma } from '@prisma/client';

class DatabaseOperationError extends Error {
  constructor(
    message: string,
    public originalError: Error | null = null,
  ) {
    super(message);
    this.name = 'DatabaseOperationError';
  }
}

export function handleDatabaseError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new DatabaseOperationError(
          'A unique constraint violation occurred.',
          error,
        );
      case 'P2025':
        throw new DatabaseOperationError(
          'A required record was not found.',
          error,
        );
      case 'P2003':
        throw new DatabaseOperationError(
          'A foreign key constraint failed.',
          error,
        );
      case 'P2001':
        throw new DatabaseOperationError(
          'The record searched for in the where condition does not exist.',
          error,
        );
      // Add more specific error codes as needed
      default:
        throw new DatabaseOperationError(
          `A database error occurred. Code: ${error.code}`,
          error,
        );
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseOperationError(
      'Invalid data provided for the operation.',
      error,
    );
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new DatabaseOperationError(
      'An unknown database error occurred.',
      error,
    );
  } else if (error instanceof Error) {
    throw new DatabaseOperationError(
      'An unexpected error occurred during the database operation.',
      error,
    );
  } else {
    throw new DatabaseOperationError('An unknown error occurred.');
  }
}
