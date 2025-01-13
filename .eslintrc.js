module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.app.json', './tsconfig.spec.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    'plugin:@angular-eslint/recommended', // Angular-specific linting rules
    'plugin:@angular-eslint/template/process-inline-templates', // Inline templates
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Type-aware rules
    'plugin:prettier/recommended', // Integrates Prettier with ESLint
  ],
  plugins: [
    '@angular-eslint', // Angular-specific plugin
    '@typescript-eslint', // TypeScript plugin
    'prettier', // Prettier plugin
  ],
  rules: {
    // Prettier integration
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // Angular-specific rules
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'app', style: 'kebab-case' },
    ],
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'app', style: 'camelCase' },
    ],

    // TypeScript-specific rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
  overrides: [
    {
      // Files for Angular templates
      files: ['*.html'],
      parser: '@angular-eslint/template-parser',
      plugins: ['@angular-eslint/template'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        // Turn off all type-aware rules for Angular templates
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-base-to-string': 'off',
        '@typescript-eslint/no-duplicate-type-constituents': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-redundant-type-constituents': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-enum-comparison': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      // Spec and test files
      files: ['*.spec.ts', '*.d.ts'],
      extends: ['plugin:jasmine/recommended'],
      plugins: ['jasmine'],
      env: {
        jasmine: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'jasmine/no-focused-tests': 'error',
        'jasmine/no-disabled-tests': 'warn',

        // Turn off type-aware rules for spec files
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
};
