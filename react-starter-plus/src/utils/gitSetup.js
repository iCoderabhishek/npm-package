import { execSync } from 'child_process';
import fs, { copyFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export function initGit(projectRoot) {
  try {
    execSync('git init', { cwd: projectRoot, stdio: 'ignore' });

    // Copy .gitignore template
    const gitignoreSrc = path.join(__dirname, '..', '..', 'templates', '.gitignore');
      const gitignoreDest = path.join(projectRoot, '.gitignore');
      
      if (!fs.existsSync(gitignoreDest)) {
          copyFileSync(gitignoreSrc, gitignoreDest);
      }

    execSync('git add .', { cwd: projectRoot });
    execSync('git commit -m "Initial commit 🎉"', { cwd: projectRoot });

    console.log('\n ✔ Git initialized');
  } catch (err) {
    console.error('\n ✗ Git setup failed:', err.message);
  }
}

export function addRemoteAndPush(projectRoot, remoteUrl) {
    try {
        execSync(`git remote add origin ${remoteUrl}`, { cwd: projectRoot });
        execSync(`git branch -M main`, { cwd: projectRoot });
        execSync(`git push -u origin main`, { cwd: projectRoot });
        console.log('✔ Code pushed to GitHub!');
    } catch (err) {
        console.error('✗ Git push failed:', err.message);
    }
}
