# Commands

## audit

Checks repository maintenance files and prints a maintenance-readiness score.

```bash
node src/index.js audit
```

The score is a structural open-source maintenance checklist. It is not a code-quality, security, documentation-quality, or test-coverage score.

## issue-triage

Suggests an issue label from a text file.

```bash
node src/index.js issue-triage examples/sample-issue.txt
```

The triage command now uses weighted label scoring instead of returning the first keyword match. This reduces false positives such as classifying `SECURITY.md` file mentions as security vulnerabilities when the issue is actually about a failing workflow.

Possible labels:

- `bug`
- `security`
- `documentation`
- `enhancement`
- `question`
- `needs-triage`

## pr-summary

Summarizes changed files.

```bash
node src/index.js pr-summary examples/sample-pr-files.txt
```

The input file should contain one changed file path per line.

## changelog

Generates a changelog draft.

```bash
node src/index.js changelog examples/sample-changelog-input.txt
```

The changelog command prioritizes Conventional Commit prefixes before fallback keyword matching. For example, `test: add audit command tests` is categorized as `Tests`, not `Added`.

Recognized Conventional Commit types include `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build`, `ci`, `perf`, `style`, `revert`, and `security`.

## risk-check

Detects security-sensitive and breaking-change signals.

```bash
node src/index.js risk-check examples/sample-risk-input.txt
```

The command distinguishes between free text, diffs, and file lists. Credential-like terms in actual text or diff content are treated as stronger risk signals than the same terms appearing only in file paths.

Examples:

- `+ const token = "..."` in a diff can be high risk.
- `src/tokenStore.js` in a file list is a weaker path-level signal and should be reviewed with the actual diff.
