const baseConfig = require('./jest-base.e2e');

module.exports = Object.assign(baseConfig, {
  moduleNameMapper: {
    // This follows tsconfig.development.json
    '^@pyxismedia/lib-model/(.*)$': '<rootDir>/../../lib-model/src/$1'
  },
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  }
});
