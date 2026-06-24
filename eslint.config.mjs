// @ts-check

import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      playwright,
    },
    rules: {
      // Playwright-specific rules
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-force-option': 'warn',
      'playwright/no-page-pause': 'error',
      'playwright/prefer-web-first-assertions': 'warn',
      'playwright/valid-expect': 'error',
      'playwright/max-nested-describe': ['warn', { max: 2 }],
      'playwright/no-conditional-in-test': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-standalone-expect': 'error',
    },
  },
);
