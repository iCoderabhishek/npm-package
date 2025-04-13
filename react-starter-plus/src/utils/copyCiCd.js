import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyCiCd({ projectName, language }) {
  const projectPath = path.join(process.cwd(), projectName);
  const ciCdPath = path.join(__dirname, '../../boilerplates', language, 'ci-cd', '.github');

  console.log(chalk.cyan('⚙️  Adding CI/CD setup...'));

  const targetPath = path.join(projectPath, '.github');

  await fs.copy(ciCdPath, targetPath);

  console.log(chalk.green('✅ CI/CD (GitHub Actions) setup complete!'));
}
