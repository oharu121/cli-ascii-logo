# /github-npm-release

Create a GitHub issue, run release checks, bump version, and create a GitHub release.

This command combines issue documentation with automated release workflow: remote sync, checks (typecheck/lint/test), build, commit, version bump, push, and GitHub release creation.

## Instructions

You have access to the full conversation context. Use it to understand what was implemented.

---

## Phase 1: Issue Creation (Steps 1-9)

### Step 1: Gather Context

From the session, identify:
- What feature/fix was implemented
- Which files were modified
- What the key changes were
- Any breaking changes or deprecations

### Step 2: Ask for Title

Use AskUserQuestion with:
- 3 suggested titles based on the work done (concise, action-oriented)
- "Other" option allows free input

Example titles:
- "Add typecheck, lint, deploy commands"
- "Fix config loading for nested paths"
- "Refactor step execution flow"

### Step 3: Ask for Labels

Use AskUserQuestion with multiSelect=true:
- Options: enhancement, bug, documentation, refactor
- "Other" option allows custom labels (comma-separated)

### Step 4: Ask for Version/Milestone

Read package.json to get current version (e.g., "1.0.0"), then use AskUserQuestion:
- patch: v1.0.1
- minor: v1.1.0
- major: v2.0.0
- Skip (no milestone)

Note: Always prefix versions with "v" (e.g., "v1.1.0" not "1.1.0") for milestone names.

**Store the selected version type** (patch/minor/major/skip) for use in Step 15.

### Step 5: Create Plan File

Create `.plans/<slugified-title>.md` with this structure:

```markdown
# Plan: <Title>

**Status:** Completed
**Date:** <YYYY-MM-DD>

## Goal

<Brief description of what was implemented>

## Summary of Changes

<Bullet list of key changes>

## Files Modified

- [file1.ts](path/to/file1.ts) - <what changed>
- [file2.ts](path/to/file2.ts) - <what changed>

## Breaking Changes

<List any breaking changes, or "None">

## Deprecations

<List any deprecations, or "None">
```

### Step 6: Update CHANGELOG.md

If CHANGELOG.md exists in the project root:

1. If version was selected:
   - Find or create `## [version]` section
   - Add entry with today's date

2. If version was skipped:
   - Find or create `## [Unreleased]` section
   - Add entry without date

Use appropriate subsections:
- `### Added` - for new features
- `### Changed` - for changes in existing functionality
- `### Deprecated` - for soon-to-be removed features
- `### Fixed` - for bug fixes
- `### Removed` - for removed features

### Step 7: Update README.md (if needed)

Check if implementation affects any documented features:
- Configuration options (commands, steps, git, github sections)
- CLI flags (--skip-*, --dry-run, etc.)
- API/programmatic usage
- Workflow steps

If so, update the relevant sections to match the implementation.

### Step 8: Create GitHub Issue

#### 8a: Handle Milestone (if version was selected)

If user selected a version (not "Skip"), first check if the milestone exists and create it if needed:

```bash
# Check if milestone exists
gh api repos/{owner}/{repo}/milestones --jq '.[] | select(.title == "<version>") | .title'
```

If the milestone does NOT exist (empty output), create it:

```bash
gh api repos/{owner}/{repo}/milestones -f title="<version>" -f state="open"
```

#### 8b: Create the Issue

Use gh CLI to create the issue:

```bash
gh issue create \
  --title "<title>" \
  --label "<label1>,<label2>" \
  --assignee "@me" \
  --milestone "<version>" \
  --body "<body>"
```

Notes:
- Always include `--assignee "@me"` to assign the issue to the current user
- Omit `--milestone` if user selected "Skip"

Issue body format - Include the FULL plan file content followed by acceptance criteria:

```markdown
<Full content of the plan file from .plans/<filename>.md>

---

## Acceptance Criteria

### AC-1: <First criterion name>

| Criteria | Description |
|----------|-------------|
| Given | <precondition> |
| When | <action> |
| Then | <expected result> |
| Evidence | |

### AC-2: <Second criterion name>

| Criteria | Description |
|----------|-------------|
| Given | <precondition> |
| When | <action> |
| Then | <expected result> |
| Evidence | |

---

Plan file: [.plans/<filename>.md](.plans/<filename>.md)
```

IMPORTANT: The issue body should contain the COMPLETE plan file content (Goal, Summary of Changes, Files Modified, etc.), NOT a summary.

### Step 9: Generate Commit Message

After the issue is created successfully, parse the issue URL to get the issue number, then generate and **store** the commit message:

```
feat(<scope>): <description> (#<issue-number>)
```

Where:
- `<scope>` is the main area changed (e.g., commands, config, cli, steps)
- `<description>` is a concise summary in lowercase
- `<issue-number>` is extracted from the created issue URL

For bug fixes, use `fix(<scope>)` instead of `feat(<scope>)`.
For documentation only, use `docs(<scope>)`.
For refactoring, use `refactor(<scope>)`.

Output to the user:
```
Issue created: <full-url>

Proceeding with release automation...
```

---

## Phase 2: Release Automation (Steps 10-18)

### Step 10: Check Remote Status

Check if there are commits on the remote that you don't have locally:

```bash
git fetch
```

```bash
git rev-list --count HEAD..@{u}
```

If the count is greater than 0:

1. Inform the user: "Remote has X commit(s) you don't have locally"

2. Check for uncommitted changes:
   ```bash
   git status --porcelain
   ```

3. If uncommitted changes exist, use AskUserQuestion:
   - "You have uncommitted changes. Commit them before pulling?"
   - Options: Yes (commit with WIP message), No (cancel)

4. If user says Yes, commit changes:
   ```bash
   git add .
   git commit -m "WIP: save changes before pulling remote updates"
   ```

5. Ask user to confirm pull:
   - "Pull latest changes before continuing?"
   - Options: Yes, No (cancel)

6. If user says Yes:
   ```bash
   git pull --rebase
   ```

If pull fails due to conflicts, stop and instruct user to resolve conflicts manually.

### Step 11: Detect Available Scripts

Check which check scripts are available in package.json:

```bash
npm pkg get scripts.typecheck
npm pkg get scripts.lint
npm pkg get scripts.test
npm pkg get scripts.build
```

Each command returns the script content or `{}` if not found.

Inform the user which checks will run:
- "Will run: typecheck, lint, test" (if all exist)
- "Will run: lint, test (typecheck not configured)" (if some missing)
- "No check scripts found - skipping checks" (if none exist)

### Step 12: Run Checks

Run each available check script in order. Stop on first failure.

**Typecheck** (if available):
```bash
npm run typecheck
```
If fails: Stop, show error, output "Fix the type errors and re-run /github-release"

**Lint** (if available):
```bash
npm run lint
```
If fails: Stop, show error, output "Fix the lint errors (try: npm run lint:fix) and re-run /github-release"

**Test** (if available):
```bash
npm run test
```
If fails: Stop, show error, output "Fix the failing tests and re-run /github-release"

If all checks pass, continue to next step.

### Step 13: Run Build

If `build` script exists:

```bash
npm run build
```

If build fails: Stop, show error, output "Fix the build errors and re-run /github-release"

### Step 14: Show Changes & Commit

Display the changes that will be committed:

```bash
git status --short
```

List the files that were modified (plan file, CHANGELOG, README if updated, build artifacts if any).

Use AskUserQuestion to confirm:
- "Commit these changes?"
- Show the commit message from Step 9
- Options:
  - "Yes, use this message" (proceed with stored commit message)
  - "No, use custom message" (prompt for custom message)
  - "Cancel" (stop execution)

If Yes or custom message provided:
```bash
git add .
git commit -m "<commit-message>"
```

### Step 15: Bump Version

**If user selected "Skip" in Step 4:**

Use AskUserQuestion:
- "You chose to skip version bump earlier. Confirm skipping version bump and GitHub release?"
- Options:
  - "Yes, skip version & release" (proceed to push without version bump, skip GitHub release)
  - "No, select a version now" (re-prompt for version: patch/minor/major)

**If version type is selected (patch/minor/major):**

Get current version:
```bash
npm pkg get version
```

Run version bump (this creates a git tag automatically):
```bash
npm version <patch|minor|major>
```

Capture the new version from output (e.g., "v1.2.0").

If npm version fails (tag exists, dirty working dir), stop and show error with guidance.

### Step 16: Push to Remote

Use AskUserQuestion:
- "Push commits and tags to remote?"
- Options:
  - "Yes, push now"
  - "No, I'll push manually later"
  - "Cancel"

If Yes:
```bash
git push && git push --tags
```

If push fails, warn user and show manual command:
```
Push failed. Run manually:
  git push && git push --tags
```

If No: Inform user "Remember to push manually: git push && git push --tags"

### Step 17: Create GitHub Release (Draft)

**Skip this step if version was skipped.**

First, check if gh CLI is available and authenticated:

```bash
gh --version
```

```bash
gh auth status
```

If gh is not installed or not authenticated, warn user and provide manual release URL:
```
GitHub CLI not available. Create release manually at:
  https://github.com/<owner>/<repo>/releases/new?tag=v<version>
```

**Create the release:**

Prepare the release body by taking the plan file content and removing the `# Plan: <Title>` header line (keep everything from `**Status:**` onwards).

```bash
gh release create v<version> \
  --title "<version> - <plan-title>" \
  --draft \
  --notes "<plan-content-without-header>"
```

Where:
- `<version>` is the new version (e.g., "1.2.0")
- `<plan-title>` is the title from Step 2
- `<plan-content-without-header>` is the plan file content starting from `**Status:**`

If release creation fails, warn user and provide manual URL.

### Step 18: Output Success

Display final summary:

**If version was bumped:**
```
Release complete!

Issue: <issue-url>
Version: <old-version> -> <new-version>
Tag: v<new-version>
Release (draft): <github-release-url>

The release was created as a draft. Review and publish at:
  https://github.com/<owner>/<repo>/releases
```

**If version was skipped:**
```
Changes committed and pushed!

Issue: <issue-url>
Commit: <commit-message>

No version bump or GitHub release (skipped as requested).
```

---

## Error Handling Summary

| Scenario | Action |
|----------|--------|
| Remote fetch fails | Warn and continue (might be offline) |
| Pull fails (conflicts) | Stop, instruct to resolve conflicts |
| Typecheck fails | Stop, show errors, suggest fixes |
| Lint fails | Stop, show errors, suggest `npm run lint:fix` |
| Tests fail | Stop, show errors, suggest fixes |
| Build fails | Stop, show error |
| Commit fails | Stop (likely pre-commit hook) |
| npm version fails | Stop (tag exists? dirty working dir?) |
| Push fails | Warn, show manual push command |
| gh not installed | Warn, provide manual release URL |
| gh not authenticated | Warn, suggest `gh auth login` |

---

## Example Session

User runs `/github-release` after implementing a new feature:

1. **Phase 1 - Issue Creation:**
   - Title: "Add dark mode support"
   - Labels: enhancement
   - Version: minor (v1.2.0)
   - Creates `.plans/add-dark-mode-support.md`
   - Updates CHANGELOG.md
   - Creates GitHub issue #7
   - Generates commit message: `feat(ui): add dark mode support (#7)`

2. **Phase 2 - Release Automation:**
   - Remote check: Up to date
   - Scripts detected: typecheck, lint, test, build
   - Runs typecheck... passed
   - Runs lint... passed
   - Runs test... passed
   - Runs build... passed
   - Shows changes, confirms commit
   - Bumps version: 1.1.0 -> 1.2.0
   - Pushes to remote
   - Creates draft GitHub release

3. **Final Output:**
   ```
   Release complete!

   Issue: https://github.com/user/repo/issues/7
   Version: 1.1.0 -> 1.2.0
   Tag: v1.2.0
   Release (draft): https://github.com/user/repo/releases/tag/v1.2.0

   The release was created as a draft. Review and publish at:
     https://github.com/user/repo/releases
   ```
