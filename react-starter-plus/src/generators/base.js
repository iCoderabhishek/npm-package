import path from 'path';
import prompts from 'prompts';
import ora from 'ora';  // Importing ora for the spinner

import { copyBase } from '../utils/copyBase.js';
import { installReactDeps } from '../utils/setupReact.js';
import { setupTailwind } from '../utils/setupTailwind.js';
import { addRemoteAndPush, initGit } from '../utils/gitSetup.js';
import { copyCiCd } from '../utils/copyCiCd.js';
import { deployNow, deployToVercel } from '../utils/setupVercel.js';
import { setupRouting } from '../utils/setupRouting.js';
import { setupZustand } from '../utils/setupZustand.js';
import { setupTesting } from '../utils/setupTesting.js';

export async function askForConfirmation() {
  const { proceed } = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: '❓ Do you want to proceed with this setup?',
    initial: false, // set default to "No"
  });

  return proceed;
}

export async function generateBaseProject(options) {
  const {
    projectName,
    language,
    useGit,
    pushToRemote,
    remoteUrl,
    includeCiCd,
    vercelDeploy,
    deployNowChoice,
    includeZustand,
    includeTesting,
  } = options;

  // Show summary first
  console.log('🌟 Summary of your project setup:');
  console.log(`  Project name: ${projectName}`);
  console.log(`  Language: ${language}`);
  console.log(`  Git initialized: ${useGit ? 'Yes' : 'No'}`);
  console.log(`  Push to remote: ${pushToRemote ? 'Yes' : 'No'}`);
  if (pushToRemote && remoteUrl) console.log(`  Remote URL: ${remoteUrl}`);
  console.log(`  CI/CD setup: ${includeCiCd ? 'Yes' : 'No'}`);
  console.log(`  Vercel deployment: ${vercelDeploy ? 'Yes' : 'No'}`);
  console.log(`  Deploy now: ${deployNowChoice === 'yes' ? 'Yes' : 'No'}`);
  console.log(`  Zustand for state management: ${includeZustand ? 'Yes' : 'No'}`);
  console.log(`  React Testing Library: ${includeTesting ? 'Yes' : 'No'}`);

  const confirmed = await askForConfirmation();

  if (!confirmed) {
    console.log('❌ Setup cancelled by user.');
    return;
  }

  console.log('✅ Proceeding with project setup...');

  // Initialize spinner
  const spinner = ora('Initializing project setup...').start();

  try {
    await copyBase({ projectName, language });
    spinner.text = 'Installing React dependencies...';  // Update spinner text
    installReactDeps(projectName);

    spinner.text = 'Setting up Tailwind CSS...';
    await setupTailwind({ projectName, language });

    const projectRoot = path.join(process.cwd(), projectName);
    spinner.text = 'Setting up routing...';
    setupRouting(projectRoot);

    if (useGit) {
      spinner.text = 'Initializing Git repository...';
      initGit(projectRoot);
      if (pushToRemote && remoteUrl) {
        spinner.text = 'Pushing to remote repository...';
        addRemoteAndPush(projectRoot, remoteUrl);
      }
    }

    if (includeCiCd) {
      spinner.text = 'Setting up CI/CD...';
      await copyCiCd({ projectName, language });
    }

    if (includeZustand !== undefined) {
      spinner.text = 'Setting up Zustand...';
      await setupZustand({
        projectName,
        language,
        includeZustand,
      });
    }

    if (includeTesting) {
      spinner.text = 'Setting up testing environment...';
      await setupTesting({ projectName, language });
    }

    if (vercelDeploy) {
      spinner.text = 'Setting up Vercel deployment...';
      await deployToVercel(projectName);
    }

    if (deployNowChoice === 'yes') {
      spinner.text = 'Deploying project now...';
      await deployNow(projectName);
    } else {
      spinner.text = 'Deployment ready for later...';
      console.log('🚀 You can deploy later by running the following command:');
      console.log(`  cd ${projectName} && vercel --prod`);
      console.log('⚡ Ensure you are in the project root directory when running this.');
    }

    spinner.succeed('🎉 Setup complete! Happy hacking!');
  } catch (error) {
    spinner.fail('❌ Setup failed.');
    console.error(error);
  }
}
