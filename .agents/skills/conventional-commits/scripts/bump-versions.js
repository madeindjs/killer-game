#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = findProjectRoot(process.cwd());
const ROOT_PKG = path.join(PROJECT_ROOT, 'package.json');

const WORKSPACES = readWorkspaces();

function findProjectRoot(cwd) {
  let dir = cwd;
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, '.git'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('Could not locate project root (no package.json + .git found)');
    }
    dir = parent;
  }
}

function readWorkspaces() {
  const pkg = JSON.parse(fs.readFileSync(ROOT_PKG, 'utf8'));
  return Array.isArray(pkg.workspaces) ? pkg.workspaces : [];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const typeArg = args.find((a) => a.startsWith('--type='));
  const type = typeArg ? typeArg.slice('--type='.length) : 'patch';
  if (!['patch', 'minor', 'major'].includes(type)) {
    throw new Error(`Invalid --type "${type}". Use patch, minor, or major.`);
  }
  return { type };
}

function nextVersion(version, type) {
  const parts = version.split('.').map(Number);
  const [major, minor, patch] = parts;
  if ([major, minor, patch].some((n) => Number.isNaN(n))) {
    throw new Error(`Cannot parse version "${version}"`);
  }
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function getTouchedScopes() {
  const diff = execSync('git diff --cached --name-only', {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
  });
  const files = diff.split('\n').filter(Boolean);
  const touchedWorkspaces = new Set();
  let touchedRoot = false;

  for (const file of files) {
    let matched = false;
    for (const ws of WORKSPACES) {
      if (file === `${ws}/package.json` || file.startsWith(`${ws}/`)) {
        touchedWorkspaces.add(ws);
        matched = true;
        break;
      }
    }
    if (!matched) {
      touchedRoot = true;
    }
  }

  return { workspaces: Array.from(touchedWorkspaces), root: touchedRoot };
}

function detectBaseBranch() {
  try {
    const headRef = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    }).trim();
    if (headRef === 'HEAD') {
      return null;
    }
    const candidates = ['main', 'master', 'dev', 'develop'];
    for (const candidate of candidates) {
      try {
        execSync(`git rev-parse --verify refs/heads/${candidate}`, {
          cwd: PROJECT_ROOT,
          encoding: 'utf8',
          stdio: 'pipe',
        });
        return candidate;
      } catch {}
      try {
        execSync(`git rev-parse --verify refs/remotes/origin/${candidate}`, {
          cwd: PROJECT_ROOT,
          encoding: 'utf8',
          stdio: 'pipe',
        });
        return `origin/${candidate}`;
      } catch {}
    }
  } catch {}
  return null;
}

function versionAtMergeBase(refPath) {
  try {
    const mergeBase = execSync(`git merge-base HEAD ${refPath}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
    const content = execSync(`git show ${mergeBase}:${refPath}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    const pkg = JSON.parse(content);
    return pkg.version || null;
  } catch {
    return null;
  }
}

function alreadyBumpedOnBranch() {
  const base = detectBaseBranch();
  const result = { workspaces: new Set(), root: false };
  if (!base) {
    return result;
  }
  for (const ws of WORKSPACES) {
    const refPath = `${ws}/package.json`;
    const baseVersion = versionAtMergeBase(refPath);
    if (baseVersion === null) {
      continue;
    }
    const currentRaw = fs.readFileSync(path.join(PROJECT_ROOT, refPath), 'utf8');
    const currentVersion = JSON.parse(currentRaw).version;
    if (currentVersion !== baseVersion) {
      result.workspaces.add(ws);
    }
  }
  const baseRootVersion = versionAtMergeBase('package.json');
  if (baseRootVersion !== null) {
    const currentRootVersion = JSON.parse(fs.readFileSync(ROOT_PKG, 'utf8')).version;
    if (currentRootVersion !== baseRootVersion) {
      result.root = true;
    }
  }
  return result;
}

function bumpPackageJson(pkgPath, type) {
  const raw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  const oldVersion = pkg.version;
  pkg.version = nextVersion(oldVersion, type);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  return oldVersion;
}

function main() {
  const { type } = parseArgs();
  const { workspaces, root } = getTouchedScopes();

  if (workspaces.length === 0 && !root) {
    console.log('No staged changes detected; nothing to bump.');
    return;
  }

  const alreadyBumped = alreadyBumpedOnBranch();
  const filesToStage = [];

  for (const ws of workspaces) {
    if (alreadyBumped.workspaces.has(ws)) {
      console.log(`Skipping ${ws}: already bumped on this branch.`);
      continue;
    }
    const pkgPath = path.join(PROJECT_ROOT, ws, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      console.warn(`Skipping ${ws}: package.json not found at ${pkgPath}`);
      continue;
    }
    const oldVersion = bumpPackageJson(pkgPath, type);
    console.log(`Bumped ${ws}: ${oldVersion} → ${JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version}`);
    filesToStage.push(pkgPath);
  }

  if (root && !alreadyBumped.root) {
    const oldVersion = bumpPackageJson(ROOT_PKG, type);
    console.log(`Bumped root: ${oldVersion} → ${JSON.parse(fs.readFileSync(ROOT_PKG, 'utf8')).version}`);
    filesToStage.push(ROOT_PKG);
  } else if (root && alreadyBumped.root) {
    console.log('Skipping root: already bumped on this branch.');
  }

  if (filesToStage.length > 0) {
    execSync(`git add ${filesToStage.map((f) => path.relative(PROJECT_ROOT, f)).join(' ')}`, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
    });
  } else {
    console.log('All touched scopes already bumped on this branch; nothing to stage.');
  }
}

main();
