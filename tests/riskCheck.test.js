const test = require("node:test");
const assert = require("node:assert");
const { findRiskSignals, classifyRisk, inferInputKind, analyzeRisk } = require("../src/riskCheck");

test("detects token and secret signals in free text", () => {
  const signals = findRiskSignals("Changed token and secret handling");
  assert.deepStrictEqual(signals, ["secret", "token"]);
});

test("classifies high risk for credential-like text signals", () => {
  assert.strictEqual(classifyRisk(["token"]), "high");
});

test("classifies medium risk", () => {
  assert.strictEqual(classifyRisk(["permission"]), "medium");
});

test("classifies no risk", () => {
  assert.strictEqual(classifyRisk([]), "none");
});

test("infers file-list input", () => {
  assert.strictEqual(inferInputKind("src/index.js\ntests/index.test.js"), "file-list");
});

test("does not treat token-like file paths as high risk without diff content", () => {
  const result = analyzeRisk("src/tokenStore.js\nsrc/auth/session.js");
  assert.strictEqual(result.inputKind, "file-list");
  assert.strictEqual(result.riskLevel, "medium");
  assert.ok(result.signals.includes("token"));
  assert.ok(result.signals.includes("auth"));
});

test("treats token leak diff content as high risk", () => {
  const result = analyzeRisk("diff --git a/src/auth.js b/src/auth.js\n+ const token = 'hardcoded-secret';");
  assert.strictEqual(result.inputKind, "diff");
  assert.strictEqual(result.riskLevel, "high");
});


test("detects sensitive file-list directories across multiple lines", () => {
  const signals = findRiskSignals("src/index.js\nmigrations/drop-old-permissions.sql", { inputKind: "file-list" });
  assert.ok(signals.includes("migration"));
  assert.ok(signals.includes("permission"));
});
