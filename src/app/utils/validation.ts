// Validation utility functions
// Following the clean architecture principle of single-responsibility utilities

import { ValidationError } from '../types/api.types';

// PubMed query validation
export function validatePubMedQuery(query: string): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!query || query.trim().length === 0) {
    errors.push({
      field: 'query',
      message: 'Query is required',
      code: 'REQUIRED'
    });
  }

  if (query.length > 1000) {
    errors.push({
      field: 'query',
      message: 'Query must be less than 1000 characters',
      code: 'TOO_LONG'
    });
  }

  // Basic syntax validation for common PubMed operators
  const invalidPatterns = [
    { pattern: /\[\]\s*\[/g, message: 'Empty brackets are not allowed' },
    { pattern: /\(\s*\)/g, message: 'Empty parentheses are not allowed' },
    { pattern: /AND\s+AND/g, message: 'Duplicate AND operators' },
    { pattern: /OR\s+OR/g, message: 'Duplicate OR operators' },
    { pattern: /NOT\s+NOT/g, message: 'Duplicate NOT operators' }
  ];

  invalidPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(query)) {
      errors.push({
        field: 'query',
        message,
        code: 'INVALID_SYNTAX'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Job name validation
export function validateJobName(name: string): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Job name is required',
      code: 'REQUIRED'
    });
  }

  if (name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Job name must be less than 100 characters',
      code: 'TOO_LONG'
    });
  }

  if (name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Job name must be at least 3 characters',
      code: 'TOO_SHORT'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Numeric field validation
export function validatePositiveInteger(value: number, fieldName: string, max?: number): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!Number.isInteger(value) || value <= 0) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be a positive integer`,
      code: 'INVALID_NUMBER'
    });
  }

  if (max && value > max) {
    errors.push({
      field: fieldName,
      message: `${fieldName} cannot exceed ${max}`,
      code: 'EXCEEDS_MAXIMUM'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Date validation
export function validateDateRange(dateFrom?: string, dateTo?: string): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (dateFrom && dateTo) {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    if (fromDate > toDate) {
      errors.push({
        field: 'date_range',
        message: 'Start date must be before end date',
        code: 'INVALID_DATE_RANGE'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// URL validation
export function validateUrl(url: string): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!url) return { isValid: true, errors: [] }; // Optional field

  try {
    new URL(url);
  } catch {
    errors.push({
      field: 'url',
      message: 'Invalid URL format',
      code: 'INVALID_URL'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Comprehensive form validation
export function validateJobForm(formData: {
  name: string;
  query: string;
  max_results?: number;
  date_from?: string;
  date_to?: string;
  concurrency?: number;
}): { isValid: boolean; errors: ValidationError[] } {
  const allErrors: ValidationError[] = [];

  // Validate each field
  const nameValidation = validateJobName(formData.name);
  const queryValidation = validatePubMedQuery(formData.query);
  const concurrencyValidation = formData.concurrency
    ? validatePositiveInteger(formData.concurrency, 'concurrency', 10)
    : { isValid: true, errors: [] };
  const maxResultsValidation = formData.max_results
    ? validatePositiveInteger(formData.max_results, 'max_results', 10000)
    : { isValid: true, errors: [] };
  const dateValidation = validateDateRange(formData.date_from, formData.date_to);

  // Combine all errors
  allErrors.push(...nameValidation.errors);
  allErrors.push(...queryValidation.errors);
  allErrors.push(...concurrencyValidation.errors);
  allErrors.push(...maxResultsValidation.errors);
  allErrors.push(...dateValidation.errors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}
