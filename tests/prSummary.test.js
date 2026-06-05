const test = require("node:test");
const assert = require("node:assert");
const { summarizeFiles, buildPrRecommendation } = require("../src/prSummary");

test("summarizes changed files", () => {
  const result = summarizeFiles("src/index.js\ntests/index.test.js\nREADME.md");
  assert.strictEqual(result.summary.total, 3);
  assert.strictEqual(result.summary.source, 1);
  assert.strictEqual(result.summary.tests, 1);
});

test("recommends tests when source changes without tests", () => {
  const result = summarizeFiles("src/index.js");
  const recommendations = buildPrRecommendation(result.summary);
  assert.ok(recommendations.some((item) => item.includes("tests")));
});
