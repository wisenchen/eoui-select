module.exports = {
  preset: "jest-playwright-preset",
  testPathIgnorePatterns: ["/node_modules/", "lib"],
  testMatch: ["**/e2e/**/*.test.ts"],
  verbose: true,
};
