module.exports = {
    printWidth: 160,
    tabWidth: 4,
    singleQuote: false,
    trailingComma: "all",
    arrowParens: "always",
    singleAttributePerLine: true,
    overrides: [
        {
            // These files may be run as-is in IE 11 and must not have ES5-incompatible trailing commas
            files: ["*.html", "*.htm"],
            options: {
                trailingComma: "es5",
            },
        },
    ],
};
