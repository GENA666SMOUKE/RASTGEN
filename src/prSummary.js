const { readTextFile, printSection } = require("./utils");

function summarizeFiles(text) {
  const files = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const summary = {
    total: files.length,
    source: files.filter((file) => file.startsWith("src/") || file.startsWith("lib/")).length,
    tests: files.filter((file) => file.startsWith("tests/") || file.includes(".test.") || file.includes(".spec.")).length,
    docs: files.filter((file) => file.startsWith("docs/") || file.toLowerCase().includes("readme") || file.endsWith(".md")).length,
    github: files.filter((file) => file.startsWith(".github/")).length,
    config: files.filter((file) => file.endsWith(".json") || file.endsWith(".yml") || file.endsWith(".yaml")).length
  };

  return { files, summary };
}

function buildPrRecommendation(summary) {
  const recommendations = [];

  if (summary.source > 0 && summary.tests === 0) {
    recommendations.push("Source files changed without test files. Consider adding or updating tests.");
  }

  if (summary.github > 0) {
    recommendations.push("GitHub workflow or repository configuration changed. Maintainer review is recommended.");
  }

  if (summary.docs > 0 && summary.source === 0) {
    recommendations.push("Documentation-only change detected. Review for clarity and accuracy.");
  }

  if (recommendations.length === 0) {
    recommendations.push("No obvious PR structure concerns detected.");
  }

  return recommendations;
}

async function generatePrSummary(filePath) {
  const text = readTextFile(filePath);
  const { files, summary } = summarizeFiles(text);

  printSection("RASTGEN Pull Request Summary");

  console.log(`Changed files: ${summary.total}`);
  console.log(`Source files: ${summary.source}`);
  console.log(`Test files: ${summary.tests}`);
  console.log(`Documentation files: ${summary.docs}`);
  console.log(`GitHub configuration files: ${summary.github}`);
  console.log(`Configuration files: ${summary.config}`);

  printSection("Files");
  for (const file of files) {
    console.log(`- ${file}`);
  }

  printSection("Maintainer recommendations");
  for (const recommendation of buildPrRecommendation(summary)) {
    console.log(`- ${recommendation}`);
  }
}

module.exports = {
  generatePrSummary,
  summarizeFiles,
  buildPrRecommendation
};
