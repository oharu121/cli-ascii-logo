#!/usr/bin/env node

/**
 * Interactive release script for forge-npm-pkg
 * Automates the release workflow with beautiful prompts and robust error handling
 */

import * as clack from '@clack/prompts';
import { execSync } from 'child_process';
import { exit } from 'process';

/**
 * Executes a shell command with error handling
 * @param {string} command - The command to execute
 * @param {boolean} silent - Whether to suppress output
 * @returns {string} Command output
 * @throws {Error} If command fails
 */
function exec(command, silent = false) {
  try {
    return execSync(command, {
      stdio: silent ? 'pipe' : 'inherit',
      encoding: 'utf-8'
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

/**
 * Main release workflow
 */
async function release() {
  console.clear();

  clack.intro('🚀 Release Tool');

  clack.note('Press ESC at any time to cancel', 'Tip');

  // Step 1: Check current branch
  let currentBranch;
  try {
    currentBranch = exec('git branch --show-current', true).trim();
  } catch {
    clack.log.error('Failed to check current branch');
    clack.outro('Make sure you are in a git repository');
    exit(1);
  }

  const mainBranches = ['main', 'master'];
  if (!mainBranches.includes(currentBranch)) {
    clack.log.warn(`You are on branch: ${currentBranch}`);

    clack.note(
      'Releases are typically made from main/master branch.\n' +
      'Publishing from a feature branch may cause issues.',
      '⚠️  Warning:'
    );

    const shouldContinue = await clack.confirm({
      message: 'Continue anyway?',
      initialValue: false,
    });

    if (clack.isCancel(shouldContinue) || !shouldContinue) {
      clack.cancel('Release cancelled - switch to main branch first');
      exit(0);
    }
  }

  // Step 2: Check if remote has new commits
  const s1 = clack.spinner();
  s1.start('Checking remote status...');

  try {
    // Fetch latest from remote without merging
    exec('git fetch', true);

    // Check if remote is ahead of local
    const behind = exec('git rev-list --count HEAD..@{u} 2>nul || echo 0', true).trim();

    if (behind !== '0') {
      s1.stop('⚠️  Remote has new commits');

      clack.note(
        `Remote has ${behind} commit(s) you don't have locally.\n` +
        'This is likely from Dependabot or another developer.',
        'Remote ahead:'
      );

      const shouldPull = await clack.confirm({
        message: 'Pull latest changes before continuing?',
        initialValue: true,
      });

      if (clack.isCancel(shouldPull) || !shouldPull) {
        clack.cancel('Release cancelled - pull changes first with: npm run sync');
        exit(0);
      }

      // Check for uncommitted changes before pulling
      const status = exec('git status --porcelain', true).trim();
      if (status) {
        clack.log.warn('You have uncommitted changes');

        try {
          const statusOutput = exec('git status --short', true);
          clack.note(statusOutput, 'Uncommitted changes:');
        } catch {
          // Ignore if we can't show status
        }

        const shouldCommitFirst = await clack.confirm({
          message: 'Commit changes before pulling? (recommended)',
          initialValue: true,
        });

        if (clack.isCancel(shouldCommitFirst) || !shouldCommitFirst) {
          clack.cancel('Release cancelled - commit or stash your changes first');
          exit(0);
        }

        // Commit the changes
        try {
          exec('git add .');
          exec('git commit -m "WIP: save changes before pulling remote updates"');
          clack.log.success('Changes committed');
        } catch (error) {
          clack.log.error('Failed to commit changes');
          clack.log.error(error.message);
          clack.outro('Fix the issue and try again');
          exit(1);
        }
      }

      // Safe to pull now
      const s1b = clack.spinner();
      s1b.start('Pulling latest changes...');
      try {
        exec('git pull --rebase');
        exec('npm install');
        s1b.stop('✅ Pulled and synced successfully');
      } catch (error) {
        s1b.stop('❌ Pull failed');
        clack.log.error(error.message);
        clack.outro('Fix conflicts and try again');
        exit(1);
      }
    } else {
      s1.stop('✅ Up to date with remote');
    }
  } catch {
    s1.stop('⚠️  Could not check remote status');
    clack.log.warn('Proceeding anyway...');
  }

  // Step 3: Run tests
  const s2 = clack.spinner();
  s2.start('Running tests...');
  try {
    exec('npm run test:all');
    s2.stop('✅ All tests passed');
  } catch (error) {
    s2.stop('❌ Tests failed');
    clack.log.error(error.message);
    clack.outro('Fix the tests and try again');
    exit(1);
  }

  // Step 4: Check git status
  let status;
  try {
    status = exec('git status --porcelain', true).trim();
  } catch {
    clack.log.error('Failed to check git status');
    clack.outro('Make sure you are in a git repository');
    exit(1);
  }

  if (!status) {
    clack.note('No changes to commit');

    const continueAnyway = await clack.confirm({
      message: 'No changes detected. Continue with version bump?',
      initialValue: false,
    });

    if (clack.isCancel(continueAnyway) || !continueAnyway) {
      clack.cancel('Release cancelled');
      exit(0);
    }
  } else {
    // Show what will be committed
    try {
      const statusOutput = exec('git status --short', true);
      clack.note(statusOutput, 'Changes to be committed:');
    } catch {
      clack.log.warn('Could not show git status');
    }

    const shouldCommit = await clack.confirm({
      message: 'Commit these changes?',
      initialValue: true,
    });

    if (clack.isCancel(shouldCommit) || !shouldCommit) {
      clack.cancel('Release cancelled');
      exit(0);
    }

    // Step 5: Get commit message
    const commitMsg = await clack.text({
      message: 'Commit message:',
      placeholder: 'feat: add new feature',
      validate: (value) => {
        if (!value) return 'Commit message is required';
      },
    });

    if (clack.isCancel(commitMsg)) {
      clack.cancel('Release cancelled');
      exit(0);
    }

    // Commit changes with error handling
    try {
      exec('git add .');
      exec(`git commit -m "${commitMsg}"`);
      clack.log.success('Changes committed');
    } catch (error) {
      clack.log.error('Failed to commit changes');
      clack.log.error(error.message);
      clack.note(
        'This could happen if:\n' +
        '  • Pre-commit hooks failed\n' +
        '  • Commit message has special characters\n' +
        '  • Working directory has issues',
        'Common causes:'
      );
      clack.outro('Fix the issue and try again');
      exit(1);
    }
  }

  // Step 6: Version bump
  const versionType = await clack.select({
    message: 'Select version bump:',
    options: [
      { value: 'patch', label: 'Patch (bug fixes)', hint: 'x.x.X' },
      { value: 'minor', label: 'Minor (new features)', hint: 'x.X.0' },
      { value: 'major', label: 'Major (breaking changes)', hint: 'X.0.0' },
    ],
  });

  if (clack.isCancel(versionType)) {
    clack.cancel('Release cancelled');
    exit(0);
  }

  // Get current version
  let currentVersion;
  try {
    currentVersion = exec('npm pkg get version', true).trim().replace(/"/g, '');
  } catch {
    clack.log.error('Failed to get current version');
    exit(1);
  }

  const s3 = clack.spinner();
  s3.start(`Bumping ${versionType} version...`);
  try {
    const output = exec(`npm version ${versionType}`, true);
    const newVersion = output.trim().replace('v', '');
    s3.stop(`✅ Version bumped: ${currentVersion} → ${newVersion}`);
  } catch (error) {
    s3.stop('❌ Version bump failed');
    clack.log.error(error.message);
    clack.note(
      'This could happen if:\n' +
      '  • Working directory is not clean\n' +
      '  • Git tag already exists\n' +
      '  • npm version scripts failed',
      'Common causes:'
    );
    clack.outro('Fix the issue and try again');
    exit(1);
  }

  // Step 7: Push to remote
  const shouldPush = await clack.confirm({
    message: 'Push to remote? (triggers CD workflow)',
    initialValue: true,
  });

  if (clack.isCancel(shouldPush) || !shouldPush) {
    clack.note(
      'Version bumped locally. Push manually when ready:\n  git push && git push --tags',
      'Manual push required:'
    );
    clack.outro('Release prepared');
    exit(0);
  }

  const s4 = clack.spinner();
  s4.start('Pushing to remote...');
  try {
    exec('git push && git push --tags');
    s4.stop('✅ Pushed to remote');
  } catch (error) {
    s4.stop('❌ Push failed');
    clack.log.error(error.message);
    clack.note(
      'This could happen if:\n' +
      '  • Network connection issues\n' +
      '  • No upstream branch configured\n' +
      '  • Remote rejected push (conflicts)\n' +
      '\n' +
      'Your version was bumped locally. Push manually:\n' +
      '  git push && git push --tags',
      'Common causes:'
    );
    clack.outro('Push manually to complete release');
    exit(1);
  }

  clack.outro('🎉 Release complete!');
}

// Run the release workflow
release().catch((error) => {
  console.error('Unexpected error:', error.message);
  exit(1);
});
