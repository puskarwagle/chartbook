import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
import globals from 'globals';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'svelte/require-each-key': 'off',
			// Maps/Sets here are local temporaries inside $derived (not mutable
			// reactive state), so plain Map/Set is correct. Avoid false positives.
			'svelte/prefer-svelte-reactivity': 'off',
			'no-empty': 'warn'
		}
	},
	{
		ignores: ['build', '.svelte-kit', 'dist', 'node_modules']
	}
);
