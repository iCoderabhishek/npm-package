import { execSync } from 'child_process';
import path from 'path';

export function setupRouting(projectRoot) {
  console.log('🧭 Installing React Router DOM...');
  execSync('npm install react-router-dom', {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
  });

  console.log('✅ React Router installed!');
}
