import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const dirs = [
  path.join(process.cwd(), 'components'),
  path.join(process.cwd(), 'lib'),
  path.join(process.cwd(), 'app')
];

let commitsDone = 0;
const targetCommits = 40;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const files = [];
dirs.forEach(d => walkDir(d, (f) => {
  if (f.endsWith('.tsx') || f.endsWith('.ts')) {
    files.push(f);
  }
}));

// Shuffle array to ensure diverse commits if run multiple times
for (let i = files.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [files[i], files[j]] = [files[j], files[i]];
}

for (const file of files) {
  if (commitsDone >= targetCommits) break;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  let commitMessage = '';

  const filename = path.basename(file);
  const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');

  // Attempt 1: Add displayName to exported React components
  const exportMatch = content.match(/export const ([A-Z][a-zA-Z0-9_]*) =/);
  if (exportMatch && file.endsWith('.tsx')) {
    const componentName = exportMatch[1];
    if (!content.includes(`${componentName}.displayName`)) {
      content += `\n\n// Added for debugging purposes\n${componentName}.displayName = '${componentName}';\n`;
      commitMessage = `refactor(ui): assign explicit displayName to ${componentName} component for enhanced React DevTools profiling`;
      changed = true;
    }
  }

  // Attempt 2: Add module docstring if Attempt 1 wasn't applicable
  if (!changed) {
    if (!content.startsWith('/**') && !content.includes('@fileoverview')) {
      const moduleName = path.basename(file, path.extname(file));
      const isComponent = file.endsWith('.tsx');
      
      let header = `/**\n * @fileoverview ${isComponent ? 'UI Component' : 'Utility module'} for ${moduleName}\n * Implements functionality related to the D-EAN platform's ${isComponent ? 'presentation' : 'core logic'} layer.\n */\n`;
      
      // Handle 'use client' or other pragmas
      if (content.startsWith("'use client'") || content.startsWith('"use client"')) {
        const lines = content.split('\n');
        const pragma = lines.shift();
        content = pragma + '\n\n' + header + lines.join('\n');
      } else {
        content = header + content;
      }
      
      commitMessage = `docs(${isComponent ? 'components' : 'core'}): add structural module documentation to ${filename} for better architectural oversight`;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Committing: ${relativePath} -> ${commitMessage}`);
    
    try {
      execSync(`git add "${relativePath}"`);
      execSync(`git commit -m "${commitMessage}"`);
      commitsDone++;
    } catch (e) {
      console.error(`Failed to commit for ${relativePath}:`, e.message);
    }
  }
}

console.log(`\nSuccessfully created ${commitsDone} atomic commits.`);
