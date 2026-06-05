const test = require("node:test");
const assert = require("node:assert");
const { buildGitHubActionInputKeys, getGitHubActionInput, resolveInvocation } = require("../src/index");

test("builds GitHub Action input keys for dashed input names", () => {
  const keys = buildGitHubActionInputKeys("input-file");
  assert.ok(keys.includes("INPUT_INPUT-FILE"));
  assert.ok(keys.includes("INPUT_INPUT_FILE"));
});

test("reads GitHub Action dashed input env names", () => {
  assert.strictEqual(
    getGitHubActionInput("input-file", { "INPUT_INPUT-FILE": "examples/input.txt" }),
    "examples/input.txt"
  );
});

test("reads GitHub Action underscore input env names", () => {
  assert.strictEqual(
    getGitHubActionInput("input-file", { INPUT_INPUT_FILE: "examples/input.txt" }),
    "examples/input.txt"
  );
});

test("CLI arguments take precedence over action inputs", () => {
  const invocation = resolveInvocation(
    ["node", "src/index.js", "risk-check", "cli.txt"],
    { INPUT_MODE: "audit", INPUT_INPUT_FILE: "action.txt" }
  );

  assert.deepStrictEqual(invocation, {
    mode: "risk-check",
    inputFile: "cli.txt"
  });
});
