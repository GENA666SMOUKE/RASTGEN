const { readTextFile, printSection } = require("./utils");

const ISSUE_RULES = [
  {
    label: "security",
    patterns: [
      [/\b(cve-?\d{4}-?\d+)\b/i, 6],
      [/\b(vulnerability|exploit|xss|csrf|rce|sql injection)\b/i, 5],
      [/\b(token|secret|credential|password|api key)\b.*\b(leak|exposed|stolen|compromised)\b/i, 5],
      [/\b(leak|exposed|stolen|compromised)\b.*\b(token|secret|credential|password|api key)\b/i, 5],
      [/\b(security issue|security concern|security bug|security report)\b/i, 4],
      [/\b(permission escalation|privilege escalation|unauthorized access)\b/i, 5]
    ]
  },
  {
    label: "bug",
    patterns: [
      [/\b(bug|regression|broken)\b/i, 4],
      [/\b(crash|crashes|crashed|exception|stack trace)\b/i, 4],
      [/\b(error|failure|fails|failed|failing|does not work|doesn't work|cannot|can't)\b/i, 3],
      [/\b(unexpected|incorrect|wrong)\b/i, 2]
    ]
  },
  {
    label: "documentation",
    patterns: [
      [/\b(docs|documentation|readme|guide|example|tutorial)\b/i, 3],
      [/\b(typo|unclear|confusing|missing docs)\b/i, 3],
      [/\bsecurity\.md\b/i, 1]
    ]
  },
  {
    label: "enhancement",
    patterns: [
      [/\b(feature request|enhancement|proposal)\b/i, 4],
      [/\b(add|support|improve|allow|enable|request)\b/i, 2],
      [/\b(would be nice|it would be useful|please add)\b/i, 3]
    ]
  },
  {
    label: "question",
    patterns: [
      [/\b(question|help|clarify|is it possible)\b/i, 3],
      [/\b(how do i|how can i|why does|what is)\b/i, 3]
    ]
  }
];

const TIE_BREAK_ORDER = ["security", "bug", "documentation", "enhancement", "question"];

function scoreIssueLabels(text) {
  const scores = {};

  for (const rule of ISSUE_RULES) {
    scores[rule.label] = 0;

    for (const [pattern, weight] of rule.patterns) {
      if (pattern.test(text)) {
        scores[rule.label] += weight;
      }
    }
  }

  return scores;
}

function suggestIssueLabel(text) {
  const scores = scoreIssueLabels(text || "");
  let bestLabel = "needs-triage";
  let bestScore = 0;

  for (const label of TIE_BREAK_ORDER) {
    const score = scores[label] || 0;
    if (score > bestScore) {
      bestLabel = label;
      bestScore = score;
    }
  }

  return bestScore >= 3 ? bestLabel : "needs-triage";
}

function explainIssueLabel(label) {
  const explanations = {
    security: "The issue contains strong security-sensitive signals such as a vulnerability, exploit, credential leak, or unauthorized access.",
    bug: "The issue appears to describe incorrect behavior, a failure, an exception, or a regression.",
    documentation: "The issue appears to concern docs, README, examples, guides, or documentation clarity.",
    enhancement: "The issue appears to request a feature, capability, or improvement.",
    question: "The issue appears to ask for clarification or usage help.",
    "needs-triage": "No strong signal was found; manual maintainer triage is recommended."
  };
  return explanations[label] || explanations["needs-triage"];
}

async function triageIssue(filePath) {
  const text = readTextFile(filePath);
  const label = suggestIssueLabel(text);

  printSection("RASTGEN Issue Triage");
  console.log(`Suggested label: ${label}`);
  console.log(`Reason: ${explainIssueLabel(label)}`);
}

module.exports = {
  triageIssue,
  suggestIssueLabel,
  scoreIssueLabels,
  explainIssueLabel
};
