const test = require("node:test");
const assert = require("node:assert");
const { suggestIssueLabel, scoreIssueLabels, explainIssueLabel } = require("../src/issueTriage");

test("detects bug issues", () => {
  assert.strictEqual(suggestIssueLabel("The app crashes with an error"), "bug");
});

test("detects security issues", () => {
  assert.strictEqual(suggestIssueLabel("Token leak vulnerability found"), "security");
});

test("does not misclassify SECURITY.md failure as a security report", () => {
  assert.strictEqual(
    suggestIssueLabel("GitHub Action fails when SECURITY.md is missing"),
    "bug"
  );
});

test("detects documentation issues", () => {
  assert.strictEqual(suggestIssueLabel("README example is unclear"), "documentation");
});

test("returns needs-triage for unknown issue", () => {
  assert.strictEqual(suggestIssueLabel("Something strange happened"), "needs-triage");
});

test("exposes label scores for debugging", () => {
  const scores = scoreIssueLabels("Please add support for JSON output");
  assert.ok(scores.enhancement >= 3);
});

test("explanation exists", () => {
  assert.ok(explainIssueLabel("bug").length > 0);
});
