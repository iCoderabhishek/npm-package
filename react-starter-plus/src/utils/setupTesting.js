import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

export async function setupTesting({ projectName, language }) {
  const isTS = language === 'ts';
  const projectPath = path.join(process.cwd(), projectName);
  const boilerplateBasePath = path.resolve(`boilerplates/${language}`);
  const boilerplateTestingPath = path.join(boilerplateBasePath, 'testing');

  console.log("🧪 Setting up React Testing Library...");

  // 1. Copy boilerplate testing files
  const targetTestPath = path.join(projectPath, 'testing');
  await fs.ensureDir(targetTestPath);

  const testFileExtension = isTS ? 'tsx' : 'jsx';
  const sourceTestFile = path.join(boilerplateTestingPath, `App.test.${testFileExtension}`);
  const targetTestFile = path.join(targetTestPath, `App.test.${testFileExtension}`);

  try {
    await fs.copy(sourceTestFile, targetTestFile);
    console.log(`📄 Copied ${path.basename(sourceTestFile)} to ${targetTestPath}`);
  } catch (error) {
    console.error(`❌ Error copying test file: ${error.message}`);
  }

  const sourceSetupFile = path.join(boilerplateTestingPath, `setupTests.${isTS ? 'ts' : 'js'}`);
  const targetSetupFile = path.join(targetTestPath, `setupTests.${isTS ? 'ts' : 'js'}`);

  try {
    if (await fs.pathExists(sourceSetupFile)) {
      await fs.copy(sourceSetupFile, targetSetupFile);
      console.log(`📄 Copied ${path.basename(sourceSetupFile)} to ${targetTestPath}`);
    } else {
      const defaultSetupContent = `import '@testing-library/jest-dom';\n`;
      await fs.writeFile(targetSetupFile, defaultSetupContent);
      console.log(`🛠️ Created default setupTests.js`);
    }
  } catch (error) {
    console.error(`❌ Error handling setupTests file: ${error.message}`);
  }

  // 2. Install dependencies (Babel presets included)
  const baseDeps = [
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'jest',
    'jest-environment-jsdom',
    'babel-jest',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react'
  ];

  const tsDeps = ['ts-jest', '@types/jest'];

  const deps = isTS ? [...baseDeps, ...tsDeps] : baseDeps;

  // console.log("📦 Installing latest versions of test dependencies (no deprecated packages)...");

  execSync(`npm install -D ${deps.join(' ')}  --loglevel=error --no-fund --no-audit`, {
    cwd: projectPath,
    stdio: 'inherit'
  });

  // 3. Add testing script and Babel config to package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJsonContent = await fs.readJson(packageJsonPath);

  packageJsonContent.scripts = {
    ...packageJsonContent.scripts,
    test: isTS ? 'jest --config jest.config.ts' : 'jest',
  };

  packageJsonContent.babel = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
  };

  await fs.writeJson(packageJsonPath, packageJsonContent, { spaces: 2 });
  // console.log("✍️ Updated package.json with test script and Babel configuration.");

  // 4. Add jest config
  const jestConfigFile = path.join(projectPath, isTS ? 'jest.config.ts' : 'jest.config.js');

  const setupFilesAfterEnvPath = './testing/setupTests.js';
  const setupFilesAfterEnvTSPath = './testing/setupTests.ts';

  const jestConfigContent = isTS
    ? `import type { Config } from 'jest';
import { existsSync } from 'fs';
import { join } from 'path';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: [existsSync(join(__dirname, '${setupFilesAfterEnvTSPath}')) ? '${setupFilesAfterEnvTSPath}' : '${setupFilesAfterEnvPath}'],
};

export default config;
`
    : `const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\\\.[jt]sx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./testing/setupTests.js'],
};

export default config;
`;

  await fs.writeFile(jestConfigFile, jestConfigContent);
  // console.log(`🛠️ Created ${path.basename(jestConfigFile)}`);

  console.log('✅ Testing setup complete!');
}