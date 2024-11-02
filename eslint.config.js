import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs['flat/recommended'],
  perfectionist.configs['recommended-natural'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    files: ['**/*.js', '**/*.cjs', '**/*.ts', '**/*.svelte'],
    rules: {
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-interfaces': 'off'
    }
  },
  {
    files: ['**/*.svelte'],
    rules: {
      'perfectionist/sort-svelte-attributes': [
        'warn',
        {
          customGroups: {
            this: 'this',
            'bind-this': 'bind:this',
            class: 'class',
            'bind-directives': 'bind:*',
            'use-directives': 'use:*'
          },
          groups: [
            ['this', 'bind-this'],
            'class',
            'unknown',
            'svelte-shorthand',
            'multiline',
            ['bind-directives', 'use-directives']
          ]
        }
      ]
    }
  },
  {
    ignores: [
      '{apps,packages}/*/dist/',
      '{apps,packages}/*/build/',
      '{apps,packages}/*/.svelte-kit/'
    ]
  }
);
