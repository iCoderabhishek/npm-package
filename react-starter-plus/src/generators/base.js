import path from 'path';
import prompts from 'prompts';

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
    message: ' → Do you want to proceed with this setup?',
    initial: false,
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

  console.log('\n ▸ Summary of your project setup:\n');

  const line = (label, value) =>
    console.log(`  » ${label.padEnd(30)} ${value}`);

  line('Project name:', projectName);
  line('Language:', language);
  line('Git initialized:', useGit ? 'Yes' : 'No');
  line('Push to remote:', pushToRemote ? 'Yes' : 'No');
  if (pushToRemote && remoteUrl) line('Remote URL:', remoteUrl);
  line('CI/CD setup:', includeCiCd ? 'Yes' : 'No');
  line('Vercel deployment:', vercelDeploy ? 'Yes' : 'No');
  line('Deploy now:', deployNowChoice === 'yes' ? 'Yes' : 'No');
  line('Zustand for state management:', includeZustand ? 'Yes' : 'No');
  line('React Testing Library:', includeTesting ? 'Yes' : 'No');

  console.log();

  const confirmed = await askForConfirmation();

  if (!confirmed) {
    console.log('✗ Setup cancelled by user.');
    return;
  }

  try {
    console.log('\n⧗ Setting base project files...');
    await copyBase({ projectName, language });

    console.log('⧗ Installing React dependencies...');
    installReactDeps(projectName);

    console.log('⧗ Setting up Tailwind CSS...');
    await setupTailwind({ projectName, language });

    const projectRoot = path.join(process.cwd(), projectName);

    console.log('⧗ Setting up routing...');
    setupRouting(projectRoot);

    if (useGit) {
      console.log('⧗ Initializing Git repository...');
      initGit(projectRoot);
      if (pushToRemote && remoteUrl) {
        console.log('⧗ Pushing to remote repository...');
        addRemoteAndPush(projectRoot, remoteUrl);
      }
    }

    if (includeCiCd) {
      console.log('⧗ Setting up CI/CD...');
      await copyCiCd({ projectName, language });
    }

    if (includeZustand === true) {
      console.log('⧗ Setting up Zustand...');
      await setupZustand({
        projectName,
        language,
        includeZustand,
      });
    }

    if (includeTesting) {
      console.log('⧗ Setting up testing environment...');
      await setupTesting({ projectName, language });
    }

    if (vercelDeploy) {
      console.log('⧗ Setting up Vercel deployment...');
      await deployToVercel(projectName);
    }

    if (deployNowChoice === 'yes') {
      console.log('⧗ Deploying project now...');
      await deployNow(projectName);
    } else {
      console.log('\n →  You can deploy later by running the following command:');
      console.log(`\n →  cd ${projectName} && vercel --prod`);
      console.log('\n →  Ensure you are in the project root directory when running this.');
    }

    console.log(`→ Try running your project with \`npm run dev\`.`);
  } catch (error) {
    console.error('\n✗ Setup failed.');
    console.error(error);
  }
}