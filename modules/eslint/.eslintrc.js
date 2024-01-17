/**
 * @type {import('eslint').Linter.BaseConfig}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['dist/'],
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  reportUnusedDisableDirectives: true,
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        arrowParens: 'avoid',
      },
      {
        usePrettierrc: false,
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
}
