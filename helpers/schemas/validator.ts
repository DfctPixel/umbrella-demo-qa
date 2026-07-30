/**
 * Lightweight runtime schema validator for API responses.
 * No dependencies required — validates shape, types, required/optional fields,
 * and nested structures. Designed to catch API regressions at the contract level.
 *
 * Usage in tests:
 *   const body = await r.json();
 *   const result = validateSchema(body, userSchema);
 *   expect(result.errors, result.summary).toHaveLength(0);
 */

// ── Schema Types ────────────────────────────────────────────────────────────

export interface FieldSchema {
  /** Key name in the response object */
  key: string;
  /** Expected JavaScript type */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | 'any';
  /** If true, the field must be present. Default: true */
  required?: boolean;
  /** If true, null values are accepted for this field */
  nullable?: boolean;
  /** For 'object' type: nested schema to validate */
  schema?: Schema;
  /** For 'array' type: schema of each item */
  items?: Schema;
  /** For 'number' type: minimum allowed value (inclusive) */
  min?: number;
  /** For 'number' type: maximum allowed value (inclusive) */
  max?: number;
  /** For 'string' type: one of these values */
  enum?: string[];
  /** For 'string' type: must not be empty */
  nonEmpty?: boolean;
  /** For 'string' type: must match this regex */
  pattern?: RegExp;
}

/** A schema is just an array of field definitions */
export type Schema = FieldSchema[];

export interface ValidationError {
  path: string;
  message: string;
  expected: string;
  received: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  summary: string;
}

// ── Validator ───────────────────────────────────────────────────────────────

export function validateSchema(
  data: unknown,
  schema: Schema,
  rootPath = '$',
): ValidationResult {
  const errors: ValidationError[] = [];
  if (data === null || data === undefined) {
    if (schema.length > 0) {
      errors.push({
        path: rootPath,
        message: `Expected object, got ${data === null ? 'null' : 'undefined'}`,
        expected: 'object',
        received: String(data),
      });
    }
    return { valid: errors.length === 0, errors, summary: formatSummary(errors) };
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    errors.push({
      path: rootPath,
      message: `Expected object, got ${Array.isArray(data) ? 'array' : typeof data}`,
      expected: 'object',
      received: Array.isArray(data) ? 'array' : typeof data,
    });
    return { valid: false, errors, summary: formatSummary(errors) };
  }

  const obj = data as Record<string, unknown>;

  for (const field of schema) {
    const isRequired = field.required !== false; // default true
    const fieldPath = `${rootPath}.${field.key}`;

    if (!(field.key in obj)) {
      if (isRequired) {
        errors.push({
          path: fieldPath,
          message: `Missing required field "${field.key}"`,
          expected: field.type,
          received: 'undefined',
        });
      }
      continue;
    }

    const value = obj[field.key];
    errors.push(...validateField(fieldPath, value, field));
  }

  return { valid: errors.length === 0, errors, summary: formatSummary(errors) };
}

/** Validate an array where every item must match a schema */
export function validateArraySchema(
  data: unknown,
  itemSchema: Schema,
  rootPath = '$',
): ValidationResult {
  const errors: ValidationError[] = [];
  if (!Array.isArray(data)) {
    errors.push({
      path: rootPath,
      message: `Expected array, got ${typeof data}`,
      expected: 'array',
      received: typeof data,
    });
    return { valid: false, errors, summary: formatSummary(errors) };
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i] === null || data[i] === undefined) continue;
    if (typeof data[i] !== 'object') {
      errors.push({
        path: `${rootPath}[${i}]`,
        message: `Expected object in array, got ${typeof data[i]}`,
        expected: 'object',
        received: typeof data[i],
      });
      continue;
    }
    const result = validateSchema(data[i] as Record<string, unknown>, itemSchema, `${rootPath}[${i}]`);
    errors.push(...result.errors);
  }

  return { valid: errors.length === 0, errors, summary: formatSummary(errors) };
}

// ── Internal Helpers ─────────────────────────────────────────────────────────

function validateField(path: string, value: unknown, field: FieldSchema): ValidationError[] {
  const errors: ValidationError[] = [];

  // null check
  if (value === null) {
    if (field.nullable === true) {
      return errors; // null is acceptable when explicitly allowed
    }
    if (field.type !== 'null' && field.type !== 'any') {
      errors.push({
        path,
        message: `Expected ${field.type}, got null`,
        expected: field.type,
        received: 'null',
      });
    }
    return errors;
  }

  // type check
  const actualType = Array.isArray(value) ? 'array' : typeof value;
  if (field.type !== 'any' && actualType !== field.type) {
    errors.push({
      path,
      message: `Type mismatch for "${path}"`,
      expected: field.type,
      received: actualType,
    });
    return errors; // stop — can't validate further with wrong type
  }

  // string validations
  if (field.type === 'string' && typeof value === 'string') {
    if (field.nonEmpty && value.trim().length === 0) {
      errors.push({ path, message: `Expected non-empty string`, expected: 'non-empty', received: '""' });
    }
    if (field.enum && !field.enum.includes(value)) {
      errors.push({
        path,
        message: `Value not in allowed enum`,
        expected: field.enum.join(' | '),
        received: value,
      });
    }
    if (field.pattern && !field.pattern.test(value)) {
      errors.push({
        path,
        message: `Value does not match pattern ${field.pattern}`,
        expected: field.pattern.toString(),
        received: value,
      });
    }
  }

  // number validations
  if (field.type === 'number' && typeof value === 'number') {
    if (field.min !== undefined && value < field.min) {
      errors.push({ path, message: `Value below minimum`, expected: `>= ${field.min}`, received: String(value) });
    }
    if (field.max !== undefined && value > field.max) {
      errors.push({ path, message: `Value above maximum`, expected: `<= ${field.max}`, received: String(value) });
    }
  }

  // nested object validation
  if (field.type === 'object' && field.schema && typeof value === 'object' && !Array.isArray(value)) {
    const nested = validateSchema(value as Record<string, unknown>, field.schema, path);
    errors.push(...nested.errors);
  }

  // array item validation
  if (field.type === 'array' && field.items && Array.isArray(value)) {
    const arrayResult = validateArraySchema(value, field.items, path);
    errors.push(...arrayResult.errors);
  }

  return errors;
}

function formatSummary(errors: ValidationError[]): string {
  if (errors.length === 0) return '✓ valid';
  return errors.map((e) => `${e.path}: ${e.message} (expected ${e.expected}, got ${e.received})`).join('; ');
}

// ── Helper for tests: fail if schema has errors ──────────────────────────────

export function expectSchemaValid(result: ValidationResult, context: string = ''): void {
  if (!result.valid) {
    const prefix = context ? `[${context}] ` : '';
    throw new Error(`${prefix}Schema validation failed:\n${result.summary}`);
  }
}
