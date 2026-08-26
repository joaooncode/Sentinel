import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s", "!**/*.module.ts", "!main.ts"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/domain/$1",
    "^@application/(.*)$": "<rootDir>/application/$1",
    "^@infrastructure/(.*)$": "<rootDir>/infrastructure/$1",
    "^@presentation/(.*)$": "<rootDir>/presentation/$1",
    "^@common/(.*)$": "<rootDir>/common/$1",
  },
};

export default config;
