import fs from 'fs';
import path from 'path';

export function updatePackageJsonScripts(root) {
  const packageJsonPath = path.join(root, 'package.json');
  if (!fs.existsSync(packageJsonPath)) return;

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  pkg.scripts = {
    ...(pkg.scripts || {}),
    dev: "vite",
    build: "vite build",
    preview: "vite preview"
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  console.log('✅ Added Vite scripts to package.json!');
}
