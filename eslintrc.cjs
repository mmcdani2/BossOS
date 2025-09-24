module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jsx-a11y'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/control-has-associated-label': 'error',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
  },
};
