module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"es2021": true
	},
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"rules": {
		"consistent-return": 2,
		"eqeqeq": 2,
		"no-eval": 2,
		"no-unused-vars": 2,
		"no-var": 2,
		"semi": 2,
	},
	"globals": {
		"global": true,
		"process": true,
		"describe": true,
		"test": true,
		"expect": true,
	}
};
