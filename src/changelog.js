const { readTextFile, printSection } = require("./utils");

const CONVENTIONAL_TYPE_TO_CATEGORY = {
  feat: "Added",
  fix: "Fixed",
  docs: "Documentation",
  doc: "Documentation",
  test: "Tests",
  tests: "Tests",
  refactor: "Changed",
  perf: "Changed",
  style: "Changed",
  chore: "Changed",
  build: "Changed",
  ci: "Changed",
  revert: "Removed",
  remove: "Removed",
  security: "Security"
};

function parseConventionalCommit(line) {
  const cleaned = String(line || "")
    .trim()
    .replace(/^[-*]\s+/, "")
    .replace(/^[a-f0-9]{7,40}\s+/i, "");

  const match = cleaned.match(/^([a-z]+)(?:\([^)]+\))?(!)?:\s+(.+)$/i);
  if (!match) return null;

  return {
    type: match[1].toLowerCase(),
    breaking: Boolean(match[2]) || /\bbreaking change\b/i.test(cleaned),
    subject: match[3]
  };
}

function categorizeChange(line) {
  const parsed = parseConventionalCommit(line);

  if (parsed && CONVENTIONAL_TYPE_TO_CATEGORY[parsed.type]) {
    return CONVENTIONAL_TYPE_TO_CATEGORY[parsed.type];
  }

  const normalized = String(line || "").toLowerCase();

  if (/\b(cve-?\d{4}-?\d+|security|vulnerability|exploit)\b/.test(normalized)) {
    return "Security";
  }

  if (/\b(fix|fixed|bug|patch|regression)\b/.test(normalized)) {
    return "Fixed";
  }

  if (/\b(docs?|readme|documentation|guide|example)\b/.test(normalized)) {
    return "Documentation";
  }

  if (/\b(tests?|coverage|spec)\b/.test(normalized)) {
    return "Tests";
  }

  if (/\b(remove|removed|delete|deleted|drop|dropped)\b/.test(normalized)) {
    return "Removed";
  }

  if (/\b(feat|feature|add|added|new|support)\b/.test(normalized)) {
    return "Added";
  }

  if (/\b(refactor|cleanup|change|changed|update|updated|perf|performance)\b/.test(normalized)) {
    return "Changed";
  }

  return "Changed";
}

function groupChanges(lines) {
  const groups = {};

  for (const line of lines) {
    const category = categorizeChange(line);
    if (!groups[category]) groups[category] = [];
    groups[category].push(line);
  }

  return groups;
}

async function generateChangelog(filePath) {
  const text = readTextFile(filePath);

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const groups = groupChanges(lines);

  printSection("RASTGEN Changelog Draft");

  const categoryOrder = ["Security", "Added", "Fixed", "Changed", "Removed", "Documentation", "Tests"];
  for (const category of categoryOrder) {
    const items = groups[category];
    if (!items || items.length === 0) continue;

    console.log(`### ${category}`);
    for (const item of items) {
      console.log(`- ${item}`);
    }
    console.log("");
  }
}

module.exports = {
  generateChangelog,
  categorizeChange,
  groupChanges,
  parseConventionalCommit
};
