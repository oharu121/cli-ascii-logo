# Scripts

## Release Script

Interactive release automation tool for `forge-npm-pkg`.

### Usage

```bash
npm run release
```

### What it does

The script guides you through the complete release workflow with beautiful interactive prompts:

1. **Check branch** - Warns if not on main/master branch
2. **Check remote** - Detects if remote has new commits (e.g., from Dependabot)
3. **Pull if needed** - Offers to pull latest changes if remote is ahead
4. **Test** - Runs full test suite (`typecheck`, `lint`, `test`)
5. **Review changes** - Shows what will be committed
6. **Commit** - Prompts for commit message and creates commit
7. **Version bump** - Interactive selection (patch/minor/major)
8. **Push** - Pushes commits and tags to remote (triggers CD workflow)

### Features

✅ **Interactive prompts** - Beautiful UX using `@clack/prompts`
✅ **Branch validation** - Warns if not on main/master branch
✅ **Smart remote detection** - Catches Dependabot commits before you release
✅ **Error handling** - Graceful failures with helpful error messages
✅ **Abort anytime** - Press ESC at any prompt to cancel
✅ **Safe** - Never leaves repo in broken state
✅ **Informative** - Shows exactly what's happening at each step

### Example Session

```
🚀 Release Tool

◇  Checking remote status...
◇  ✅ Up to date with remote
│
◇  ✅ All tests passed
│
┌  Changes to be committed:
│  M  src/index.ts
│  M  CHANGELOG.md
└
│
◆  Commit these changes?
│  Yes
│
◆  Commit message:
│  feat: add dynamic GitHub Actions versioning
│
◇  Changes committed
│
◆  Select version bump:
│  ● Patch (bug fixes) — x.x.X
│  ○ Minor (new features) — x.X.0
│  ○ Major (breaking changes) — X.0.0
└
│
◇  ✅ Version bumped: 2.0.0 → 2.1.0
│
◆  Push to remote? (triggers CD workflow)
│  Yes
│
◇  ✅ Pushed to remote
│
└  🎉 Release complete!
```

### Error Handling

The script handles all common failure scenarios:

- **Remote ahead** (Dependabot commits) → Offers to pull automatically
- **Uncommitted changes + remote ahead** → Clear recovery instructions (stash, pull, pop)
- **Test failures** → Stops, asks you to fix tests
- **Pre-commit hook failures** → Stops with context
- **Network issues** → Version bumped locally, provides manual push command
- **User cancellation** → Clean exit, no side effects

### Dependabot Scenario

**What happens when Dependabot merged while you have local changes:**

1. You run `npm run release`
2. Script detects remote is ahead:
   ```
   ⚠️  Remote has new commits

   ┌  Remote ahead:
   │  Remote has 1 commit(s) you don't have locally.
   │  This is likely from Dependabot or another developer.
   └

   ◆  Pull latest changes before continuing?
   │  Yes / No
   ```

3. If you have uncommitted changes, you'll see:
   ```
   ❌ Cannot pull: you have uncommitted changes

   ┌  How to fix:
   │  Recovery steps:
   │    1. Stash your changes:  git stash
   │    2. Pull latest:         git pull --rebase
   │    3. Install deps:        npm install
   │    4. Restore changes:     git stash pop
   │    5. Run release again
   └

   └  Stash your changes, pull, then retry
   ```

4. If you have no uncommitted changes, script pulls automatically:
   ```
   ◇  Pulling latest changes...
   ◇  ✅ Pulled and synced successfully
   ```

This ensures you never accidentally create conflicts or push rejected commits!

### Branch Check Scenario

**What happens when you run release from a feature branch:**

1. You run `npm run release` while on branch `feature/new-thing`
2. Script detects you're not on main/master:
   ```
   ⚠  You are on branch: feature/new-thing

   ┌  ⚠️  Warning:
   │  Releases are typically made from main/master branch.
   │  Publishing from a feature branch may cause issues.
   └

   ◆  Continue anyway?
   │  Yes / No (default: No)
   ```

3. If you select No or press ESC:
   ```
   └  Release cancelled - switch to main branch first
   ```

4. If you select Yes, the release continues but you've been warned

This prevents accidental releases from the wrong branch, which could cause:
- Version conflicts when merging to main
- Tags on wrong branch
- CD workflow triggering for non-main code

### Manual Release (Alternative)

If you prefer manual control:

```bash
npm run sync              # Pull latest + install + test
npm run test:all          # Verify everything passes
git add .
git commit -m "feat: your message"
npm version patch         # or minor, or major
git push && git push --tags
```
