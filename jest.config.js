module.exports = {
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  collectCoverageFrom: ["**/src/**", "!**/index*"],
  coverageReporters: ["html", "text-summary"]
};
