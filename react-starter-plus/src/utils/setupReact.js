import { execSync } from 'child_process';
import path from 'path';

export function installReactDeps(projectName) {
  const root = path.join(process.cwd(), projectName);
  console.log('📦 Installing React and ReactDOM...');

  execSync('npm install react react-dom', {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
}
