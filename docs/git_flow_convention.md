# Git Flow Convention

This document defines the required Git workflow for the whole team.

## 1. Start a New Task

When you receive a new task, always start from an up-to-date `main` branch.

```bash
git switch main
git fetch -a
git pull
```

## 2. Create a Branch

Create a new branch for exactly one task.

### Branch naming rule

Use this format:

```text
feat-<scope>-<short-description>
```

Where:

- `<scope>` is `be` (backend) or `fe` (frontend)
- `<short-description>` is kebab-case and clear

Examples:

- `feat-be-add-auth-login-endpoint`
- `feat-fe-add-student-dashboard`

Create branch:

```bash
git checkout -b feat-be-add-auth-login-endpoint
```

## 3. Write Implementation Plan Before Coding

Before writing code, create an implementation plan markdown file in a `docs` folder of the related module.

- Backend task: `backend/docs/...`
- Frontend task: `frontend/docs/...`

Suggested file name format:

```text
<feature-name>_plan.md
```

Example:

```text
backend/docs/auth_login_plan.md
```

## 4. Implement in Your Branch Only

- Do all coding in your task branch
- Do not commit directly to `main`
- Keep commit history clear and focused

## 5. Commit Message Rule

Use the existing project convention in [COMMIT_CONVENTION.md](../COMMIT_CONVENTION.md).

Format:

```text
<type>(<scope>): <short description>
```

Examples:

- `feat(be): add auth login endpoint`
- `fix(fe): fix sidebar collapse on mobile`

## 6. Rebase With Latest Main Before Push/PR

Before creating or updating a PR:

```bash
git switch main
git fetch -a
git pull
git switch <your-branch>
git rebase main
```

Resolve conflicts if any, then continue rebase:

```bash
git add .
git rebase --continue
```

## 7. Push Branch

```bash
git push --set-upstream origin <your-branch>
git push --force-with-lease
```

## 8. Create Pull Request

In GitHub:

- Create PR from your branch into `main`
- Fill clear PR title and description
- Assign yourself as assignee
- Request at least 1 reviewer

## 9. Merge Strategy (Required)

After approval, choose:

- `Rebase and merge`

Do not use:

- `Create a merge commit`

## 10. Delete Branch After Merge (If needed)

Branch should represent one completed feature/task.

After merge, delete branch:

```bash
git branch -d <your-branch>
git push origin --delete <your-branch>
```

## 11. Summary Checklist

- [ ] Update `main` before branching
- [ ] Create branch with correct naming rule
- [ ] Create implementation plan file before coding
- [ ] Implement only in your task branch
- [ ] Commit with project commit convention
- [ ] Rebase your branch onto latest `main`
- [ ] Push branch (`--force-with-lease` after rebase if needed)
- [ ] Create PR, assign self, request reviewer(s)
- [ ] Merge using `Rebase and merge`
- [ ] Delete branch after merge
