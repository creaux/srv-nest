module.export = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "src",
  "testRegex": ".spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.development.json'
    }
  }
};
