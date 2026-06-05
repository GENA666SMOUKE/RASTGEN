const test = require("node:test");
const assert = require("node:assert");
const { categorizeChange, groupChanges, parseConventionalCommit } = require("../src/changelog");

test("categorizes features as Added", () => {
  assert.strictEqual(categorizeChange("feat: add audit command"), "Added");
});

test("categorizes fixes as Fixed", () => {
  assert.strictEqual(categorizeChange("fix: handle missing file"), "Fixed");
});

test("prioritizes conventional commit type over fallback keywords", () => {
  assert.strictEqual(categorizeChange("test: add audit command tests"), "Tests");
});

test("categorizes docs conventional commits as Documentation", () => {
  assert.strictEqual(categorizeChange("docs(readme): add action usage"), "Documentation");
});

test("parses conventional commits with scope and breaking marker", () => {
  assert.deepStrictEqual(parseConventionalCommit("feat(api)!: change auth contract"), {
    type: "feat",
    breaking: true,
    subject: "change auth contract"
  });
});

test("groups changes", () => {
  const groups = groupChanges(["feat: add command", "fix: patch bug", "test: add coverage"]);
  assert.ok(groups.Added.length === 1);
  assert.ok(groups.Fixed.length === 1);
  assert.ok(groups.Tests.length === 1);
});
