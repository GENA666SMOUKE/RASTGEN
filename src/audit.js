const { fileExists, printSection } = require("./utils");

function getAuditChecks() {
  return [
    ["README.md", "Project overview and usage instructions"],
    ["LICENSE", "Open-source license"],
    ["CONTRIBUTING.md", "Contribution guidelines"],
    ["SECURITY.md", "Security reporting policy"],
    ["CHANGELOG.md", "Release history"],
    ["CODE_OF_CONDUCT.md", "Community standards"],
    [".github/PULL_REQUEST_TEMPLATE.md", "Pull request template"],
    [".github/ISSUE_TEMPLATE/bug_report.md", "Bug report template"],
    [".github/ISSUE_TEMPLATE/feature_request.md", "Feature request template"],
    [".github/ISSUE_TEMPLATE/documentation.md", "Documentation issue template"],
    [".github/workflows/ci.yml", "Continuous integration workflow"],
    ["docs/roadmap.md", "Project roadmap"],
    ["docs/commands.md", "Command documentation"]
  ];
}

function calculateAudit(root) {
  const checks = getAuditChecks();
  const results = checks.map(([file, description]) => ({
    file,
    description,
    passed: fileExists(root, file)
  }));

  const passed = results.filter((result) => result.passed).length;
  const score = Math.round((passed / checks.length) * 100);

  return { score, passed, total: checks.length, results };
}

async function runAudit(root) {
  printSection("RASTGEN Repository Maintenance Audit");

  const audit = calculateAudit(root);

  for (const result of audit.results) {
    console.log(`${result.passed ? "PASS" : "MISS"} ${result.file} — ${result.description}`);
  }

  printSection("Maintenance readiness score");
  console.log(`${audit.score}/100`);
  console.log("Note: this score checks repository maintenance structure, not code quality, test coverage, security posture, or documentation quality.");

  if (audit.score < 70) {
    console.log("Recommendation: improve repository maintenance files before accepting external contributions.");
  } else if (audit.score < 90) {
    console.log("Repository has a workable open-source maintenance structure. Some improvements are recommended.");
  } else {
    console.log("Repository has a solid open-source maintenance structure.");
  }
}

module.exports = {
  runAudit,
  calculateAudit,
  getAuditChecks
};
