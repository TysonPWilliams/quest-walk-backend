module.exports = {
	env: {
		node: true,
		es2022: true,
	},
	extends: [
		'eslint:recommended',
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		// Indentation
		'indent': ['error', 'tab'],
		'no-tabs': 'off',
		
		// Spacing
		'no-trailing-spaces': 'error',
		'no-multiple-empty-lines': ['error', { max: 2 }],
		'eol-last': 'error',
		
		// Quotes
		'quotes': ['error', 'single', { avoidEscape: true }],
		'jsx-quotes': ['error', 'prefer-double'],
		
		// Semicolons
		'semi': ['error', 'always'],
		
		// Variables
		'no-var': 'error',
		'prefer-const': 'error',
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		
		// Functions
		'arrow-spacing': 'error',
		'no-confusing-arrow': 'error',
		
		// Objects
		'object-curly-spacing': ['error', 'always'],
		'object-shorthand': 'error',
		
		// Arrays
		'array-bracket-spacing': ['error', 'never'],
		
		// Control flow
		'no-console': 'warn',
		'no-debugger': 'error',
		'no-alert': 'error',
		
		// Best practices
		'eqeqeq': ['error', 'always'],
		'curly': ['error', 'all'],
		'brace-style': ['error', '1tbs'],
		'comma-dangle': ['error', 'always-multiline'],
		'comma-spacing': 'error',
		'comma-style': 'error',
		'func-call-spacing': 'error',
		'key-spacing': 'error',
		'keyword-spacing': 'error',
		'no-multi-spaces': 'error',
		'no-mixed-spaces-and-tabs': 'error',
		'no-whitespace-before-property': 'error',
		'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
		'operator-linebreak': ['error', 'before'],
		'padded-blocks': ['error', 'never'],
		'space-before-blocks': 'error',
		'space-before-function-paren': ['error', {
			anonymous: 'always',
			named: 'never',
			asyncArrow: 'always',
		}],
		'space-in-parens': ['error', 'never'],
		'space-infix-ops': 'error',
		'space-unary-ops': 'error',
		'spaced-comment': ['error', 'always'],
		'template-tag-spacing': 'error',
		
		// Node.js specific
		'no-process-exit': 'error',
		'no-path-concat': 'error',
		
		// ES6+
		'prefer-template': 'error',
		'template-curly-spacing': 'error',
		'no-useless-constructor': 'error',
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
	},
	overrides: [
		{
			files: ['*.test.js', '*.spec.js'],
			env: {
				jest: true,
			},
		},
	],
}; 