module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    plugins: ["prettier"],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/func-call-spacing": "error",
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/semi": "error",
        "@typescript-eslint/ban-ts-ignore": "off",
        "max-len": ["error", {
            "code": 120
        }],
        "prefer-const": "error",
        "sort-keys": "error"
    }
};