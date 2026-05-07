module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'docs', 'chore', 'refactor', 'test'],
		],
		'scope-enum': [
			2,
			'always',
			['content', 'rules', 'cards', 'site', 'ci'],
		],
		'scope-empty': [2, 'never'],
		'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [0],
		'type-case': [2, 'always', 'lowercase'],
		'type-empty': [2, 'never'],
	},
};
