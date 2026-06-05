# Contributing to RASTGEN

Thank you for your interest in contributing to RASTGEN.

RASTGEN is an open-source maintainer automation toolkit for GitHub repositories. The project focuses on reducing routine maintenance work for open-source maintainers.

## Ways to contribute

You can help by:

- improving repository audit checks;
- adding new issue triage rules;
- improving PR summary logic;
- adding changelog categories;
- improving documentation;
- adding tests;
- reporting bugs;
- suggesting new maintainer workflows.

## Development setup

```bash
git clone https://github.com/GENA666SMOUKE/RASTGEN.git
cd RASTGEN
npm install
npm test
```

## Run locally

```bash
node src/index.js audit
node src/index.js issue-triage examples/sample-issue.txt
node src/index.js pr-summary examples/sample-pr-files.txt
node src/index.js changelog examples/sample-changelog-input.txt
node src/index.js risk-check examples/sample-risk-input.txt
```

## Pull request process

1. Open an issue before large changes.
2. Keep pull requests focused.
3. Add or update tests when changing logic.
4. Update documentation when changing commands.
5. Make sure CI passes.

## Code style

Keep the project simple and dependency-light. Prefer readable code over clever abstractions.
