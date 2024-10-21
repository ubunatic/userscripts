// import global rules

export default [
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                // also make to use "no-undef": "error",
                window: "readonly",
                document: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                GM: "readonly", // GreaseMonkey API
            },
        },
    },
    {
        rules: {
            // allow console.log and debugger in this script
            "no-undef": "error",
            'no-console': 'off',
            'no-debugger': 'warn',
            "no-global-assign": ["error"],
            "no-shadow": ["error", { "hoist": "functions", "allow": ["cfg"] }],
            "no-implicit-globals": "error",
            "no-unused-vars": ["warn", {"vars": "local"}],
            "no-useless-assignment": "error",
            "no-shadow-restricted-names": "error",
        },
    },
]
