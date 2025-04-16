import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { updatePackageJsonScripts } from './updatePackageJson.js';

export async function setupTailwind({ projectName, language }) {
  console.log('⚙️ setupTailwind CALLED with:', projectName, language);
  const root = path.join(process.cwd(), projectName);

  const pkgJsonPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.log('📦 package.json not found, running npm init -y...');
    execSync('npm init -y', { cwd: root, stdio: 'inherit', shell: true });
  }

  updatePackageJsonScripts(root);

  // Vite + React
  console.log('⚙️ Installing Vite...');
  execSync('npm install -D vite @vitejs/plugin-react', { cwd: root, stdio: 'inherit', shell: true });

  // ESLint + Prettier (common)
  console.log('⚙️ Installing eslint and prettier...');
  execSync('npm install -D eslint eslint-plugin-react prettier eslint-config-prettier eslint-plugin-prettier', {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });

  // Add TypeScript-specific ESLint dependencies
  if (language === 'ts') {
    console.log('⚙️ Adding TypeScript ESLint plugins...');
    execSync('npm install -D @types/react @types/react-dom @typescript-eslint/parser @typescript-eslint/eslint-plugin', {
      cwd: root,
      stdio: 'inherit',
      shell: true,
    });
  }

  // Tailwind CSS v4
  console.log('🔧 Installing Tailwind CSS v4 dependencies...');
  execSync('npm install -D tailwindcss@next postcss autoprefixer @tailwindcss/postcss', {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });

  // 📝 Write Tailwind config (ESM)
  const tailwindConfigPath = path.join(root, 'tailwind.config.mjs');
  await fs.writeFile(
    tailwindConfigPath,
    `export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`
  );

  // 📝 Write PostCSS config (ESM)
  const postCssConfigPath = path.join(root, 'postcss.config.mjs');
  await fs.writeFile(
    postCssConfigPath,
    `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};`
  );

  // 📝 Create index.css with Tailwind imports
  console.log('🎨 Adding Tailwind imports to index.css...');
  const srcDir = path.join(root, 'src');
  await fs.ensureDir(srcDir);
  const indexCssPath = path.join(srcDir, 'index.css');
  await fs.writeFile(indexCssPath, `@import "tailwindcss";`);

  // ESLint config
  console.log('📄 Writing ESLint config...');
  const eslintConfigPath = path.join(root, '.eslintrc.cjs');
  const eslintConfig = `module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    ${language === 'ts' ? `'plugin:@typescript-eslint/recommended',` : ''}
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  ${language === 'ts' ? `parser: '@typescript-eslint/parser',` : ''}
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    ${language === 'ts' ? `'@typescript-eslint',` : ''}
    'react',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'warn',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};`;

  await fs.writeFile(eslintConfigPath, eslintConfig);

  // Prettier config
  await fs.writeFile(
    path.join(root, '.prettierrc'),
    JSON.stringify(
      {
        semi: true,
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2,
        trailingComma: 'es5',
      },
      null,
      2
    )
  );

  // Ignore files
  await fs.writeFile(path.join(root, '.eslintignore'), 'node_modules\ndist\n');
  await fs.writeFile(path.join(root, '.prettierignore'), 'node_modules\ndist\n');

  // Add lint/format scripts
  const pkg = await fs.readJson(pkgJsonPath);
  pkg.scripts = {
    ...pkg.scripts,
    lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
    format: 'prettier --write .',
  };
  await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });

  console.log('✅ Tailwind + ESLint + Prettier setup complete!');
}