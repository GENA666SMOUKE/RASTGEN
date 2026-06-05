#!/usr/bin/env node

const { runAudit } = require("./audit");
const { generateChangelog } = require("./changelog");
const { generatePrSummary } = require("./prSummary");
const { triageIssue } = require("./issueTriage");
const { runRiskCheck } = require("./riskCheck");

function buildGitHubActionInputKeys(name) {
  const normalizedName = String(name || "").trim();
  if (!normalizedName) return [];

  const candidates = [
    normalizedName,
    normalizedName.replace(/ /g, "_"),
    normalizedName.replace(/[ -]/g, "_"),
    normalizedName.replace(/ /g, "-")
  ];

  return [...new Set(candidates)]
    .map((candidate) => `INPUT_${candidate.toUpperCase()}`);
}

function getGitHubActionInput(name, env = process.env) {
  for (const key of buildGitHubActionInputKeys(name)) {
    if (Object.prototype.hasOwnProperty.call(env, key) && env[key] !== undefined) {
      return String(env[key]).trim();
    }
  }

  return undefined;
}

function printHelp() {
  console.log(`RASTGEN — open-source maintainer automation toolkit

Usage:
  node src/index.js audit
  node src/index.js issue-triage <input-file>
  node src/index.js pr-summary <input-file>
  node src/index.js changelog <input-file>
  node src/index.js risk-check <input-file>

Commands:
  audit          Check repository maintenance files and readiness score
  issue-triage  Suggest an issue label from a text file
  pr-summary    Summarize changed files in a pull request
  changelog     Generate a changelog draft from text input
  risk-check    Detect security-sensitive and breaking-change signals
`);
}

function resolveInvocation(argv = process.argv, env = process.env) {
  const cliMode = argv[2];
  const cliInputFile = argv[3];

  const actionMode = getGitHubActionInput("mode", env);
  const actionInputFile = getGitHubActionInput("input-file", env);

  return {
    mode: cliMode || actionMode || "audit",
    inputFile: cliInputFile || actionInputFile
  };
}

async function main(argv = process.argv, env = process.env) {
  const { mode, inputFile } = resolveInvocation(argv, env);

  try {
    if (mode === "help" || mode === "--help" || mode === "-h") {
      printHelp();
      return;
    }

    if (mode === "audit") {
      await runAudit(process.cwd());
      return;
    }

    if (mode === "changelog") {
      await generateChangelog(inputFile);
      return;
    }

    if (mode === "pr-summary") {
      await generatePrSummary(inputFile);
      return;
    }

    if (mode === "issue-triage") {
      await triageIssue(inputFile);
      return;
    }

    if (mode === "risk-check") {
      await runRiskCheck(inputFile);
      return;
    }

    console.error(`Unknown mode: ${mode}`);
    printHelp();
    process.exitCode = 1;
  } catch (error) {
    console.error(`RASTGEN failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildGitHubActionInputKeys,
  getGitHubActionInput,
  resolveInvocation,
  main
};
