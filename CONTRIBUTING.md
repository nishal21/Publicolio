# Contributing to Publicolio

Thanks for your interest in contributing.

## Before You Start

- Check existing issues and pull requests before opening a new one.
- Keep changes focused and avoid unrelated edits in the same PR.
- Never commit secrets or personal tokens. Use local `.env` files only.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Copy environment template:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Start development server:

```bash
npm run dev
```

## Quality Checks

Run these before opening a pull request:

```bash
npm run lint
npm run build
```

## Branch and Commit Guidelines

- Create a feature branch from `main`.
- Use clear commit messages.
- Prefer small, reviewable commits.

Example branch names:

- `feature/add-new-theme`
- `fix/update-link-state`
- `docs/improve-readme`

## Pull Request Checklist

- PR title clearly describes the change.
- Include why the change is needed.
- Include screenshots/GIFs for UI changes.
- Confirm lint and build pass locally.
- Update docs when behavior changes.

## Reporting Issues

When reporting bugs, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS/environment details
- Screenshots or logs if available

## License

By contributing to this project, you agree that your contributions are licensed
under the MIT License in `LICENSE`.
