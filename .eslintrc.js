
const path = require("path");

module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "globals": {
    "chrome": true
  },
  "env": {
    "browser": true,
    "node": true,
    "mocha": [
      "**/_test/**"
    ]
  },
  "rules": {
    "react/forbid-prop-types": 0,
    "react/prefer-stateless-function": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/label-has-for": 0,
    "consistent-return": 0,
    "comma-dangle": 0,
    "spaced-comment": 0,
    "global-require": 0,
    "new-cap": 0,
    "no-case-declarations": 0,
    "no-nested-ternary": 0,
    "no-shadow": 0,
    "no-useless-escape": 0,
    "import/no-dynamic-require": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": [
      "**/_test_/**", "**/test/**"
    ] }],
    "react/no-did-mount-set-state": "off"
  },
  "overrides": {
    "files": ["**/_test_/**", ],
    "rules": {
      "no-unused-expressions": "off"
    }
  },
  "settings": {
      "import/resolver": {
        "node": {
          "paths": [
            path.resolve(__dirname, './'),
            path.resolve(__dirname, './app')
          ]
        }
      },
  },
  "plugins": [
    "react"
  ]
};
