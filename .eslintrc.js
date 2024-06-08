module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    semi: [2, 'always'], //语句强制分号结尾
    'comma-dangle': [0, 'always-multiline'],
    'no-alert': 2,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-indent': 'off',
    'vue/html-self-closing': 'off',
  },
  plugins: ['simple-import-sort'],
};
