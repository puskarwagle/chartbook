import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				document: 'readonly',
				window: 'readonly',
				localStorage: 'readonly',
				fetch: 'readonly',
				setTimeout: 'readonly',
				setInterval: 'readonly',
				clearTimeout: 'readonly',
				clearInterval: 'readonly',
				console: 'readonly',
				requestAnimationFrame: 'readonly',
				cancelAnimationFrame: 'readonly',
				HTMLCanvasElement: 'readonly',
				Blob: 'readonly',
				URL: 'readonly',
				DragEvent: 'readonly',
				KeyboardEvent: 'readonly',
				MouseEvent: 'readonly',
				PointerEvent: 'readonly',
				IntersectionObserver: 'readonly',
				HTMLElement: 'readonly'
			},
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'svelte/require-each-key': 'off',
			'svelte/prefer-svelte-reactivity': 'warn',
			'no-empty': 'warn'
		}
	},
	{
		ignores: ['build', '.svelte-kit', 'dist', 'node_modules']
	}
);
