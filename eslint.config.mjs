import { defineConfig } from "eslint/config";
import globals from "globals";
import importNewlines from "eslint-plugin-import-newlines";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginJs from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from 'eslint-plugin-react-hooks';
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default defineConfig([
    { files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"] },
    { ignores: ["dist/*"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    tseslint.configs.recommended,
    react.configs.flat.recommended,
    { settings: { react: { version: "detect" } } },
    reactHooks.configs.flat["recommended-latest"],
    jsxA11y.flatConfigs.recommended,
    stylistic.configs.customize({
        indent: 4,
        semi: true,
        jsx: false,
        arrowParens: false,
        braceStyle: "stroustrup",
        blockSpacing: true,
        quoteProps: "consistent-as-needed",
        commaDangle: "always-multiline",
    }),
    {
        plugins: {
            "import-newlines": importNewlines,
        },
        rules: {
            "import-newlines/enforce": [2, { "items": 10, "max-len": 121 }],
        },
    },
    {
        rules: {
            "@typescript-eslint/no-array-constructor": 1,
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-this-alias": 0,
            "@typescript-eslint/no-unused-vars": 1,
            "@stylistic/arrow-parens": [1, "as-needed", { requireForBlockBody: false }],
            "@stylistic/comma-dangle": 1,
            "@stylistic/max-len": [1, {
                code: 120, tabWidth: 4, ignoreTrailingComments: true, ignoreStrings: true, ignoreTemplateLiterals: true,
            }],
            "@stylistic/new-parens": 0,
            "@stylistic/no-trailing-spaces": 1,
            "@stylistic/operator-linebreak": [1, "before"],
            "@stylistic/quotes": 0,
            "func-style": [1, "declaration", { allowArrowFunctions: true }],
            "no-else-return": [1, { allowElseIf: false }],
            "no-lonely-if": 1,
            "no-useless-return": 1,
            "no-var": 2,
            "operator-assignment": 1,
            "prefer-template": 1,
            "react/prop-types": 0, // We use TypeScript for type checking
            "react/react-in-jsx-scope": 0,
            "sort-imports": [2, { ignoreCase: true }],
            "yoda": [1, "never"],
        },
    },
]);
