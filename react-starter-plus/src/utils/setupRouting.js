import { execSync } from 'child_process';

export function setupRouting(projectRoot) {
  // console.log('🧭 Installing React Router DOM...');
  execSync('npm install react-router-dom', {
    cwd: projectRoot,
    stdio: 'ignore',
    shell: true,
  });

  // console.log('✅ React Router installed!');
}
