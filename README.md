# RASTGEN

![CI](https://github.com/GENA666SMOUKE/RASTGEN/actions/workflows/ci.yml/badge.svg)

RASTGEN is an open-source maintainer automation toolkit for GitHub repositories.

It helps maintainers reduce repetitive repository work: repository health audits, issue triage, pull request summaries, changelog drafts, release note preparation, and detection of security-sensitive or breaking-change signals.

## Why RASTGEN exists

Open-source maintainers often carry a large amount of invisible work: reviewing pull requests, triaging issues, preparing releases, checking documentation, and protecting code quality. RASTGEN is designed to reduce that maintenance burden with lightweight automation that can run locally or inside GitHub Actions.

RASTGEN is intentionally dependency-light. The first public version uses deterministic rules and simple text analysis so that it can run in any repository without external services. The roadmap includes optional AI-assisted workflows for maintainers who want LLM-powered pull request summaries, issue triage, documentation checks, and security-sensitive diff analysis.

## Core features

- Repository health audit
- Issue triage suggestions
- Pull request file summary
- Changelog draft generation
- Release note preparation
- Security-sensitive keyword detection
- Breaking-change signal detection
- Documentation completeness checks
- GitHub Action integration
- Robust GitHub Action input handling for dashed and underscore input names
- Conventional Commit-aware changelog grouping
- Context-aware risk checking for text, diffs, and file lists

## Quick start

```bash
npm install
node src/index.js audit
```

Or run a demo command:

```bash
node src/index.js issue-triage examples/sample-issue.txt
node src/index.js pr-summary examples/sample-pr-files.txt
node src/index.js changelog examples/sample-changelog-input.txt
node src/index.js risk-check examples/sample-pr-files.txt
```

## CLI commands

### Repository audit

```bash
node src/index.js audit
```

Checks whether the repository contains key open-source maintenance files. The score reflects maintenance readiness, not source-code quality, test coverage, dependency security, or documentation accuracy:

- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `CODE_OF_CONDUCT.md`
- GitHub issue templates
- Pull request template
- CI workflow

### Issue triage

```bash
node src/index.js issue-triage examples/sample-issue.txt
```

Suggests labels such as:

- `bug`
- `enhancement`
- `documentation`
- `question`
- `security`
- `needs-triage`

### Pull request summary

```bash
node src/index.js pr-summary examples/sample-pr-files.txt
```

Creates a simple summary of changed files grouped by source code, tests, documentation, GitHub configuration, and other files.

### Changelog generation

```bash
node src/index.js changelog examples/sample-changelog-input.txt
```

Generates a changelog draft from a list of commits, merged changes, or release notes. Conventional Commit prefixes are evaluated before fallback keywords, so `test: add audit command tests` is categorized as tests rather than added features.

### Risk check

```bash
node src/index.js risk-check examples/sample-pr-files.txt
```

Detects security-sensitive or breaking-change-related signals, including `token`, `secret`, `auth`, `permission`, `migration`, `breaking`, `remove`, `delete`, and `security`. The command distinguishes text, diffs, and file lists so path-only signals are not treated the same as risky diff content.

## GitHub Action usage

```yaml
name: RASTGEN Audit

on:
  pull_request:
  push:
    branches: [main]

jobs:
  rastgen:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: GENA666SMOUKE/RASTGEN@v0.1.1
        with:
          mode: audit
```

Available modes:

- `audit`
- `issue-triage`
- `pr-summary`
- `changelog`
- `risk-check`

Some modes require an `input-file` value.

```yaml
- uses: GENA666SMOUKE/RASTGEN@v0.1.1
  with:
    mode: risk-check
    input-file: examples/sample-pr-files.txt
```

## Example output

```text
## RASTGEN Repository Maintenance Audit

PASS README.md — Project overview and usage instructions
PASS LICENSE — Open-source license
PASS CONTRIBUTING.md — Contribution guidelines
PASS SECURITY.md — Security reporting policy

## Maintenance readiness score

100/100
Note: this score checks repository maintenance structure, not code quality, test coverage, security posture, or documentation quality.
Repository has a solid open-source maintenance structure.
```

## Roadmap

Planned improvements:

- JSON and Markdown report output
- GitHub API integration
- Automatic PR comments
- Release note drafts based on merged pull requests
- Documentation freshness checks
- Dependency and security review helpers
- Optional AI-assisted triage and PR review workflows

See [docs/roadmap.md](docs/roadmap.md) for details.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

If you discover a security issue, please read [SECURITY.md](SECURITY.md).

## License

MIT License. See [LICENSE](LICENSE).
