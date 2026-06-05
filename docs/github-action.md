# GitHub Action usage

RASTGEN can run inside GitHub Actions.

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

Modes that process text input require an `input-file` value:

```yaml
- uses: GENA666SMOUKE/RASTGEN@v0.1.1
  with:
    mode: changelog
    input-file: examples/sample-changelog-input.txt
```

## Input handling

RASTGEN accepts both dashed and underscore input environment names for GitHub Action compatibility:

- `INPUT_INPUT-FILE`
- `INPUT_INPUT_FILE`

CLI arguments still take precedence over GitHub Action environment inputs when both are present.

## Recommended use cases

- Run `audit` on every pull request.
- Run `risk-check` when changed files or a patch diff are available as text input.
- Run `changelog` before release preparation.
- Use future GitHub API integration for automatic PR comments.
