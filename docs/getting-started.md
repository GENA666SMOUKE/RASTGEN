# Getting started with RASTGEN

RASTGEN can run as a local CLI or as a GitHub Action.

## Requirements

- Node.js 18 or newer
- GitHub repository if you want to use the GitHub Action mode

## Local usage

```bash
git clone https://github.com/GENA666SMOUKE/RASTGEN.git
cd RASTGEN
npm install
node src/index.js audit
```

## Run examples

```bash
node src/index.js issue-triage examples/sample-issue.txt
node src/index.js pr-summary examples/sample-pr-files.txt
node src/index.js changelog examples/sample-changelog-input.txt
node src/index.js risk-check examples/sample-pr-files.txt
```

## Recommended first workflow

1. Run `audit` to check repository maintenance structure.
2. Add missing files such as `SECURITY.md`, `CONTRIBUTING.md`, and PR templates.
3. Use `issue-triage` for incoming issue drafts.
4. Use `pr-summary` and `risk-check` before merging larger changes.
5. Use `changelog` before publishing a release.
