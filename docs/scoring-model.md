# Repository scoring model

The `audit` command calculates a repository maintenance-readiness score.

The current score checks for the presence of structural open-source maintenance files:

- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `CODE_OF_CONDUCT.md`
- pull request template
- bug report template
- feature request template
- documentation issue template
- CI workflow
- roadmap
- command documentation

The score is calculated as:

```text
passed checks / total checks * 100
```

## Important limitation

This score is not a general project-quality score. It does not verify:

- source-code quality;
- test coverage;
- dependency security;
- correctness of CI configuration;
- accuracy or completeness of documentation;
- actual project security posture;
- maintainer responsiveness.

A high score means the repository has a solid maintenance structure for contributors. It does not mean the implementation is production-ready or secure.

Future versions may add:

- documentation freshness checks;
- test coverage signals;
- dependency risk checks;
- release consistency checks;
- issue response time signals;
- stale issue detection;
- maintainer workload indicators.
