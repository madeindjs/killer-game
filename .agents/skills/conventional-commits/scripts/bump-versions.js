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

  const filesToStage = [];

  for (const ws of workspaces) {
    const pkgPath = path.join(PROJECT_ROOT, ws, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      console.warn(`Skipping ${ws}: package.json not found at ${pkgPath}`);
      continue;
    }
    const oldVersion = bumpPackageJson(pkgPath, type);
    console.log(`Bumped ${ws}: ${oldVersion} → ${JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version}`);
    filesToStage.push(pkgPath);
  }

  if (root) {
    const oldVersion = bumpPackageJson(ROOT_PKG, type);
    console.log(`Bumped root: ${oldVersion} → ${JSON.parse(fs.readFileSync(ROOT_PKG, 'utf8')).version}`);
    filesToStage.push(ROOT_PKG);
  }

  if (filesToStage.length > 0) {
    execSync(`git add ${filesToStage.map((f) => path.relative(PROJECT_ROOT, f)).join(' ')}`, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
    });
  }
}

main();
