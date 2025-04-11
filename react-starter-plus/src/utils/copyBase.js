import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyBase({ projectName, language }) {
  const projectPath = path.join(process.cwd(), projectName);
  const boilerplatePath = path.join(__dirname, '../../boilerplates', language, 'base');
  const templatesPath = path.join(__dirname, '../../templates');

  // Step 1: Create project folder
  console.log('📁 copyBase CALLED with:', projectName, language);

  console.log(chalk.blue(`📁 Creating project at ${projectPath}`));
  await fs.ensureDir(projectPath);

  // Step 2: Copy boilerplate files
  console.log(chalk.blue('📦 Copying base files...'));
  await fs.copy(boilerplatePath, projectPath);

  // Step 3: Copy global templates like .env, .gitignore, README
  console.log(chalk.blue('📝 Copying template files...'));
  const filesToCopy = ['.gitignore', 'README.md'];
  for (const file of filesToCopy) {
    await fs.copy(path.join(templatesPath, file), path.join(projectPath, file));
  }

  // Step 4: Write empty .env
  console.log(chalk.blue('🔐 Creating .env file...'));
  await fs.writeFile(path.join(projectPath, '.env'), '# Environment variables\n');

  console.log(chalk.green(`✅ Project ${projectName} ready!`));
}
