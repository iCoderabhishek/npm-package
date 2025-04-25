import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';


export async function setupTesting({ projectName, language }) {
  const isTS = language === 'ts';
  const projectPath = path.join(process.cwd(), projectName);
  const boilerplateBasePath = path.resolve(`boilerplates/${language}`);
  const boilerplateTestingPath = path.join(boilerplateBasePath, 'testing');

  console.log("⧗ Setting up React Testing Library...");

  // 1. Copy or create test file
  const targetTestPath = path.join(projectPath, 'testing');
  await fs.ensureDir(targetTestPath);

  const testFileExtension = isTS ? 'tsx' : 'jsx';
  const sourceTestFile = path.join(boilerplateTestingPath, `App.test.${testFileExtension}`);
  const targetTestFile = path.join(targetTestPath, `App.test.${testFileExtension}`);

  try {
    await fs.copy(sourceTestFile, targetTestFile);
    // console.log(`→  Copied ${path.basename(sourceTestFile)} to ${targetTestPath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // console.log(` App.test.${testFileExtension} not found. Creating a default test file...`);
      const defaultTest = isTS
        ? `
        import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App component", () => {
  it("renders the button with the correct text", () => {
    render(<App />);

    // Check if the button with the 'count is' text exists
    expect(screen.getByText(/count is/i)).toBeInTheDocument();
  });
});

      `.trim()
        : `import React from 'react'; 
        import { render, screen } from "@testing-library/react";
        import App from "../src/App";
        
        describe("App component", () => {
          it("renders the button with the correct text", () => {
            render(<App />);
        
            // Check if the button with the 'count is' text exists
            expect(screen.getByText(/count is/i)).toBeInTheDocument();
          });
        });
        
      `.trim();

      await fs.writeFile(targetTestFile, defaultTest);
      // console.log(`✔ Default App.test.${testFileExtension} generated.`);
    } else {
      console.error(`✗ Error copying test file: ${error.message}`);
    }
  }

  // 2. Copy or create setupTests file
  const sourceSetupFile = path.join(boilerplateTestingPath, `setupTests.${isTS ? 'ts' : 'js'}`);
  const targetSetupFile = path.join(targetTestPath, `setupTests.${isTS ? 'ts' : 'js'}`);

  try {
    if (await fs.pathExists(sourceSetupFile)) {
      await fs.copy(sourceSetupFile, targetSetupFile);
      // console.log(` Copied ${path.basename(sourceSetupFile)} to ${targetTestPath}`);
    } else {
      const defaultSetupContent = `import '@testing-library/jest-dom';\n`;
      await fs.writeFile(targetSetupFile, defaultSetupContent);
      // console.log(`→  Created default setupTests.${isTS ? 'ts' : 'js'}`);
    }
  } catch (error) {
    console.error(`✗ Error handling setupTests file: ${error.message}`);
  }

  // 3. Install dependencies
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

  execSync(`npm install -D ${deps.join(' ')} --loglevel=error --no-fund --no-audit`, {
    cwd: projectPath,
    stdio: 'inherit'
  });

  // 4. Update package.json
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

  // 5. Write Jest config
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

  console.log('\n ✔ Testing setup complete!');
}
