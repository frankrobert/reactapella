module.exports = {
  "bail": true,
  "verbose": true,
  "moduleFileExtensions": [
    "js",
    "jsx"
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/coverage/",
    "/dist/"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": -10
    }
  },
  "collectCoverageFrom": [
    "**/*.{js,jsx}"
  ]
};
