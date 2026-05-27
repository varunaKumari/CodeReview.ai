// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Creates a base ESLint flat config for TypeScript projects in the monorepo.
 *
 * @param {object} options - Configuration options.
 * @param {string} options.tsconfigPath - Absolute or relative path to the project's tsconfig.json.
 * @param {string[]} [options.ignores] - Additional glob patterns to ignore.
 * @returns {import('eslint').Linter.Config[]} ESLint flat config array.
 */
export function createBaseConfig({ tsconfigPath, ignores = [] }) {
  return tseslint.config(
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/.turbo/**',
        '**/coverage/**',
        ...ignores,
      ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: tsconfigPath,
        },
      },
      rules: {
        /** Allow underscore-prefixed variables to be unused */
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],

        /** Enforce consistent type imports for better tree-shaking */
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            disallowTypeAnnotations: true,
            fixStyle: 'separate-type-imports',
          },
        ],

        /** Enforce consistent type exports */
        '@typescript-eslint/consistent-type-exports': [
          'error',
          { fixMixedExportsWithInlineTypeSpecifier: true },
        ],

        /** Ban explicit `any` — use `unknown` instead */
        '@typescript-eslint/no-explicit-any': 'error',

        /** Require return types on exported functions for API clarity */
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowDirectConstAssertionInArrowFunctions: true,
          },
        ],

        /** Prefer nullish coalescing for safer default values */
        '@typescript-eslint/prefer-nullish-coalescing': 'error',

        /** Prefer optional chaining for cleaner property access */
        '@typescript-eslint/prefer-optional-chain': 'error',

        /** Disallow non-null assertions — handle nullable values explicitly */
        '@typescript-eslint/no-non-null-assertion': 'error',

        /** Require exhaustive switch-case handling */
        '@typescript-eslint/switch-exhaustiveness-check': 'error',

        /** Disallow floating (unhandled) promises */
        '@typescript-eslint/no-floating-promises': 'error',

        /** Disallow misused promises (e.g., in conditionals) */
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: { attributes: false } },
        ],

        /** Enforce consistent array type syntax */
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

        /** No unnecessary boolean literal comparisons */
        'no-constant-binary-expression': 'error',
      },
    },
  );
}

/**
 * Creates an ESLint flat config for Next.js applications.
 * Extends the base config with React and Next.js specific rules.
 *
 * @param {object} options - Configuration options.
 * @param {string} options.tsconfigPath - Absolute or relative path to the project's tsconfig.json.
 * @param {string[]} [options.ignores] - Additional glob patterns to ignore.
 * @returns {import('eslint').Linter.Config[]} ESLint flat config array.
 */
export function createNextConfig({ tsconfigPath, ignores = [] }) {
  return [
    ...createBaseConfig({ tsconfigPath, ignores }),
    {
      rules: {
        /** Relax return type requirement for React components */
        '@typescript-eslint/explicit-function-return-type': 'off',

        /** Allow void return in JSX event handler attributes */
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: { attributes: false } },
        ],
      },
    },
  ];
}
