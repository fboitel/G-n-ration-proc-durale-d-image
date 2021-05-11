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
		"plugin:@typescript-eslint/recommended",
	],
	"rules": {
		"consistent-return": 2,
		"eqeqeq": 2,
		"no-eval": 2,
		"no-var": 2,
		"semi": 2,
		"@typescript-eslint/no-unused-vars": 2,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/explicit-module-boundary-types": 0,
		"indent": [2, "tab", {"SwitchCase": 1}],
		"comma-dangle": [1, {
			"arrays": "always-multiline",
			"objects": "always-multiline",
			"imports": "always-multiline",
			"exports": "always-multiline",
			"functions": "ignore",
		}],
		"eol-last": 1,
	},
	"globals": {
		"global": true,
		"process": true,
		"describe": true,
		"test": true,
		"expect": true,
	}
};
