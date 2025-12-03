const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    js.configs.recommended,

    {
        files: ["**/*.js"], 
        languageOptions: {
            ecmaVersion: 2022, 
            sourceType: "commonjs", 
            globals: {
                ...globals.node, 
                ...globals.jest, 
            },
        },
        rules: {
            "no-unused-vars": "warn", 
            "no-undef": "error",      
            "no-console": "off",      
        },
    },
    
    {
        ignores: ["node_modules/", "coverage/", "dist/"],
    },
];