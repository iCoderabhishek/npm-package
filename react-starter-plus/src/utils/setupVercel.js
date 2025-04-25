import { exec as execCb, spawn } from 'child_process';
import { promisify } from 'util';
import prompts from 'prompts';

const exec = promisify(execCb);

async function checkVercelCLI() {
  try {
    await exec('vercel --version');
    return true;
  } catch {
    throw new Error('Vercel CLI is not installed.');
  }
}

async function checkVercelLogin() {
  try {
    await exec('vercel whoami');
    return true;
  } catch {
    throw new Error('Not logged in to Vercel.');
  }
}

function spawnLogin() {
  return new Promise((resolve, reject) => {
    const loginProcess = spawn('vercel', ['login'], { stdio: 'inherit' });

    loginProcess.on('close', (code) => {
      code === 0 ? resolve() : reject(new Error(`Login process exited with code ${code}`));
    });
  });
}

export async function deployNow(projectName) {
  console.log('⧗ Deploying to Vercel...');
  try {
    // Step 1: Build the project before deploying
    console.log('⧗ Building the project...');
    await exec(`cd ${projectName} && npm run build`);
    console.log('✔ Build successful!');

    // Step 2: Deploy the built project using Vercel CLI
    const { stdout, stderr } = await exec(
      `cd ${projectName} && vercel --prod --yes`
    );

    if (stderr) console.warn('⚠️ stderr:', stderr);
    console.log(`✔ Deployment successful:\n${stdout}`);
  } catch (err) {
    console.error('✗ Deployment failed:', err.message);
  }
}


export async function deployToVercel(projectName) {
  console.log('⧗ Checking Vercel CLI...');
  try {
    await checkVercelCLI();
    console.log('✔ Vercel CLI found.');
  } catch (err) {
    const { install } = await prompts({
      type: 'confirm',
      name: 'install',
      message: 'Vercel CLI is not installed. Install now?',
      initial: true,
    });

    if (install) {
      console.log('⧗ Installing Vercel CLI...');
      try {
        const { stdout, stderr } = await exec('npm install -g vercel');
        if (stderr) console.warn(' npm warnings:', stderr);
        console.log('✔ Vercel CLI installed.');
      } catch (err) {
        console.error('✗ Installation failed:', err.message);
        return;
      }
    } else {
      return;
    }
  }

  console.log('⧗ Checking Vercel login...');
  try {
    await checkVercelLogin();
    console.log('✔ Logged in to Vercel.');
  } catch (err) {
    const { login } = await prompts({
      type: 'confirm',
      name: 'login',
      message: 'You are not logged in to Vercel. Login now?',
      initial: true,
    });

    if (login) {
      console.log('⧗ Logging in...');
      try {
        await spawnLogin();
        console.log('✔ Logged in to Vercel.');
      } catch (err) {
        console.error('✗ Login failed:', err.message);
        return;
      }
    } else {
      return;
    }
  }

  // Prompt user whether to deploy immediately or later
  
 
}
