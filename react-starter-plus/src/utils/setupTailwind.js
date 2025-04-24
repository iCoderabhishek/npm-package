import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { updatePackageJsonScripts } from './updatePackageJson.js';

export async function setupTailwind({ projectName, language }) {
  // console.log('⚙️ setupTailwind CALLED with:', projectName, language);
  const root = path.join(process.cwd(), projectName);

  const pkgJsonPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    // console.log('📦 package.json not found, running npm init -y...');
    execSync('npm init -y', { cwd: root, stdio: 'ignore', shell: true });
  }

  updatePackageJsonScripts(root);

  // Display summary of packages to be installed
  // console.log(`
  //   📦 Installing the following packages:
  //   - react, react-dom
  //   - vite, @vitejs/plugin-react
  //   - eslint, prettier, eslint-plugin-react, eslint-config-prettier
  //   - tailwindcss, @tailwindcss/vite
  //   - TypeScript ESLint plugins (if TypeScript selected)
  // `);

  // Installing React and React DOM
  // console.log('⚛️ Installing react and react-dom...');
  execSync('npm install react react-dom', {
    cwd: root,
    stdio: 'ignore',
    shell: true,
  });

  // Installing Vite and React plugin
  // console.log('⚙️ Installing Vite...');
  execSync('npm install -D vite @vitejs/plugin-react', { cwd: root, stdio: 'ignore', shell: true });

  // Installing ESLint and Prettier
  // console.log('⚙️ Installing eslint and prettier...');
  execSync('npm install -D eslint eslint-plugin-react prettier eslint-config-prettier eslint-plugin-prettier', {
    cwd: root,
    stdio: 'ignore',
    shell: true,
  });

  // Add TypeScript-specific ESLint dependencies
  if (language === 'ts') {
    // console.log('⚙️ Adding TypeScript ESLint plugins...');
    execSync('npm install -D @types/react @types/react-dom @typescript-eslint/parser @typescript-eslint/eslint-plugin', {
      cwd: root,
      stdio: 'ignore',
      shell: true,
    });
  
    // Install ts-node for running TypeScript directly
    execSync('npm install -D ts-node', {
      cwd: root,
      stdio: 'ignore',
      shell: true,
    });

     // Install typescript if not already installed
    execSync('npm install -D typescript', {
      cwd: root,
      stdio: 'ignore',
      shell: true,
    });
  }
  // Installing Tailwind CSS and Vite plugin
  // console.log('🔧 Installing Tailwind CSS and Vite plugin...');
  execSync('npm install -D tailwindcss @tailwindcss/vite', {
    cwd: root,
    stdio: 'ignore',
    shell: true,
  });

  // 📝 Create index.css with Tailwind imports
  // console.log('🎨 Adding Tailwind imports to index.css...');
  const srcDir = path.join(root, 'src');
  await fs.ensureDir(srcDir);
  const indexCssPath = path.join(srcDir, 'index.css');
  await fs.writeFile(indexCssPath, `
    
    @import "tailwindcss";

    @layer base {
        * {
            @apply border-gray-200;
        }

        body {
            @apply bg-[#030303] text-white;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        html {
            overflow: hidden;
        }
    }`);

  // ESLint config
  // console.log('📄 Writing ESLint config...');
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

  // Final summary after package installation
  // console.log(`
  //   ✅ Tailwind, ESLint, Prettier, React, Vite setup complete!
  //   📦 Installed packages:
  //   - React, React DOM
  //   - Vite with React plugin
  //   - ESLint and Prettier for linting and formatting
  //   - Tailwind CSS with Vite plugin
  //   - TypeScript ESLint plugins (if TypeScript was selected)
  // `);
}
