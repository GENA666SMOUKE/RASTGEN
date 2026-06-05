# Changelog

## [0.1.1] - 2026-06-05

### Fixed

- Fixed GitHub Action input handling for `input-file` by supporting both dashed and underscore environment variable forms.
- Reduced issue-triage false positives where `SECURITY.md` file mentions could be classified as security reports.
- Fixed changelog categorization so Conventional Commit prefixes are evaluated before generic keywords.
- Reduced risk-check overstatement for credential-like terms that appear only in file paths.

### Changed

- Refactored CLI invocation resolution so it can be tested without executing the CLI on import.
- Reworded repository audit output as a maintenance-readiness score rather than a general project-quality score.
- Added input-kind detection for risk analysis: `text`, `diff`, and `file-list`.

### Tests

- Added regression tests for GitHub Action input parsing.
- Added regression tests for issue triage, changelog categorization, and file-list risk analysis.

## [0.1.0] - 2026-06-05

### Added

- Initial RASTGEN CLI structure.
- Repository audit command.
- Issue triage command.
- Pull request summary command.
- Changelog draft command.
- Risk check command.
- GitHub Action metadata.
- CI workflow.
- Documentation and examples.
