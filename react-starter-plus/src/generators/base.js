import path from 'path';
import { copyBase } from '../utils/copyBase.js';
import { installReactDeps } from '../utils/setupReact.js';
import { setupTailwind } from '../utils/setupTailwind.js';
import { addRemoteAndPush, initGit } from '../utils/gitSetup.js';
import { copyCiCd } from '../utils/copyCiCd.js';
import { deployNow, deployToVercel } from '../utils/setupVercel.js';
import prompts from 'prompts';


export async function generateBaseProject(options) {
 const {
    projectName,
    language,
    useGit,
    pushToRemote,
    remoteUrl,
    includeCiCd,
    vercelDeploy,
  } = options;

  console.log('📁 copyBase CALLED with:', projectName, language);
  await copyBase({ projectName, language });

  installReactDeps(projectName);
  console.log('⚙️ setupTailwind CALLED with:', projectName, language);
  await setupTailwind({ projectName, language });


  const projectRoot = path.join(process.cwd(), projectName);

   if (useGit) {
    initGit(projectRoot);
    if (pushToRemote && remoteUrl) {
      addRemoteAndPush(projectRoot, remoteUrl);
    }
   }
    
  if (includeCiCd) {
    await copyCiCd({ projectName, language });
  }

   // Check if the user wants to deploy to Vercel and call the helper if true
  if (vercelDeploy) {
  
    await deployToVercel(projectName); // Deploy to Vercel
  }


  const { deployNowChoice } = await prompts({
    type: 'select',
    name: 'deployNowChoice',
    message: 'Would you like to deploy now?',
    choices: [
      { title: 'Yes, deploy now', value: 'yes' },
      { title: 'No, deploy later', value: 'no' },
    ],
  });


   if (deployNowChoice === 'yes') {
    // Proceed with deployment
    await deployNow(projectName);
  } else {
    console.log('🚀 You can deploy later by running the following command:');
    console.log(`  cd ${projectName} && vercel --prod`);
    console.log('⚡ Ensure you are in the project root directory when running this.');
  }

}

