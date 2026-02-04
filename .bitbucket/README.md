# BBC Automation QA Repository

## Branching Strategy
- **main** → stable, production-ready. **Do not push directly**.
- **develop** → active development branch. All feature branches should branch from this.
- **feature/** → personal branches for tasks, e.g., `feature/NP035-api-tests`.

## Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/<jira-id>-<short-description>
