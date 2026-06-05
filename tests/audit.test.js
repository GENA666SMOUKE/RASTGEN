const test = require("node:test");
const assert = require("node:assert");
const { calculateAudit, getAuditChecks } = require("../src/audit");
const { fileExists } = require("../src/utils");

test("fileExists returns boolean", () => {
  assert.strictEqual(typeof fileExists(process.cwd(), "package.json"), "boolean");
});

test("audit checks are defined", () => {
  assert.ok(getAuditChecks().length >= 10);
});

test("calculateAudit returns score data", () => {
  const audit = calculateAudit(process.cwd());
  assert.strictEqual(typeof audit.score, "number");
  assert.ok(audit.total > 0);
});
