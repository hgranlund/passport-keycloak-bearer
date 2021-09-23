module.exports = {
  plugins: ['mocha'],
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    mocha: true,
    node: true,
    es6: true,
  },
};
