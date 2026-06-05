const { readTextFile, printSection } = require("./utils");

const TEXT_SIGNAL_DEFINITIONS = [
  ["cve", /\bcve-?\d{4}-?\d+\b/i],
  ["vulnerability", /\bvulnerabilit(y|ies)\b/i],
  ["credential", /\b(credential|api key|private key)\b/i],
  ["secret", /\bsecret\b/i],
  ["token", /\btoken\b/i],
  ["password", /\bpassword\b/i],
  ["auth", /\b(auth|authentication|authorization|oauth|jwt)\b/i],
  ["permission", /\b(permission|privilege|access control)\b/i],
  ["migration", /\b(migration|migrate|schema change)\b/i],
  ["breaking", /\b(breaking|breaking change)\b/i],
  ["delete", /\b(delete|deletion|remove|removal|drop)\b/i],
  ["security", /\bsecurity\b/i],
  ["admin", /\badmin\b/i]
];

const FILE_LIST_SIGNAL_DEFINITIONS = [
  ["auth", /(^|[\n/])(auth|oauth|session|jwt)(\.|\/|$)/i],
  ["permission", /(^|[\n/])[^\n/]*(permission|permissions|rbac|acl|policy|policies)[^\n/]*/i],
  ["migration", /(^|[\n/])(migration|migrations|schema)(\.|\/|$)/i],
  ["admin", /(^|[\n/])admin(\.|\/|$)/i],
  ["security", /(^|[\n/])(security|crypto|encryption)(\.|\/|$)/i],
  ["credential", /(^|[\n/])[^\n/]*(credential|credentials|private-key|api-key)[^\n/]*/i],
  ["secret", /(^|[\n/])[^\n/]*secret[^\n/]*/i],
  ["token", /(^|[\n/])[^\n/]*token[^\n/]*/i],
  ["password", /(^|[\n/])[^\n/]*password[^\n/]*/i]
];

function unique(items) {
  return [...new Set(items)];
}

function inferInputKind(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.some((line) => /^(diff --git|@@|\+\+\+ |--- )/.test(line))) {
    return "diff";
  }

  if (lines.length === 0) return "text";

  const pathLikeLines = lines.filter((line) => {
    if (/\s/.test(line)) return false;
    if (!/[/.]/.test(line)) return false;
    return /^[A-Za-z0-9_./@:+-]+$/.test(line);
  });

  return pathLikeLines.length / lines.length >= 0.7 ? "file-list" : "text";
}

function findRiskSignals(text, options = {}) {
  const inputKind = options.inputKind || inferInputKind(text);
  const definitions = inputKind === "file-list" ? FILE_LIST_SIGNAL_DEFINITIONS : TEXT_SIGNAL_DEFINITIONS;
  const matched = [];

  for (const [signal, pattern] of definitions) {
    if (pattern.test(text)) {
      matched.push(signal);
    }
  }

  return unique(matched);
}

function classifyRisk(signals, options = {}) {
  const inputKind = options.inputKind || "text";

  if (!signals || signals.length === 0) {
    return "none";
  }

  const highTextSignals = ["secret", "token", "password", "credential", "vulnerability", "cve"];
  const mediumSignals = ["auth", "permission", "migration", "breaking", "admin", "security", "delete"];

  if (inputKind !== "file-list" && signals.some((signal) => highTextSignals.includes(signal))) {
    return "high";
  }

  if (signals.some((signal) => highTextSignals.includes(signal) || mediumSignals.includes(signal))) {
    return "medium";
  }

  return "low";
}

function buildRiskRecommendation(riskLevel, inputKind) {
  if (riskLevel === "high") {
    return "Maintainer should perform a focused security review before merging.";
  }

  if (riskLevel === "medium" && inputKind === "file-list") {
    return "Changed file paths touch sensitive areas. Review the actual diff before merging.";
  }

  if (riskLevel === "medium") {
    return "Maintainer should manually review this change before merging.";
  }

  if (riskLevel === "low") {
    return "Light manual review is recommended; no strong high-risk signal was found.";
  }

  return "No obvious risk signals found.";
}

function analyzeRisk(text) {
  const inputKind = inferInputKind(text);
  const signals = findRiskSignals(text, { inputKind });
  const riskLevel = classifyRisk(signals, { inputKind });

  return {
    inputKind,
    signals,
    riskLevel,
    recommendation: buildRiskRecommendation(riskLevel, inputKind)
  };
}

async function runRiskCheck(filePath) {
  const text = readTextFile(filePath);
  const result = analyzeRisk(text);

  printSection("RASTGEN Risk Check");

  console.log(`Input kind: ${result.inputKind}`);
  console.log(`Risk level: ${result.riskLevel}`);

  if (result.signals.length > 0) {
    console.log("Potential risk signals:");
    for (const signal of result.signals) {
      console.log(`- ${signal}`);
    }
    console.log("");
  }

  console.log(`Recommendation: ${result.recommendation}`);
}

module.exports = {
  runRiskCheck,
  findRiskSignals,
  classifyRisk,
  inferInputKind,
  analyzeRisk,
  buildRiskRecommendation
};
