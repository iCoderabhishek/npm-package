import prompts from 'prompts';

export async function getUserOptions() {
  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: '📁 Project name:',
      initial: 'my-react-app'
    },
    {
      type: 'select',
      name: 'language',
      message: '🧠 Choose language:',
      choices: [
        { title: 'JavaScript', value: 'js' },
        { title: 'TypeScript', value: 'ts' }
      ],
      initial: 0
    },

    {
      type: 'confirm',
      name: 'useGit',
      message: '🧑‍💻 Initialize Git?',
      initial: true,
    },
    {
      type: (prev) => prev ? 'confirm' : null,
      name: 'pushToRemote',
      message: '🔗 Push to GitHub remote too?',
      initial: false,
    },
    {
      type: (prev, values) => values.pushToRemote ? 'text' : null,
      name: 'remoteUrl',
      message: '🌍 GitHub Repo URL:',
    },
    {
      type: 'confirm',
      name: 'includeCiCd',
      message: '⚙️ Add CI/CD with GitHub Actions?',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'vercelDeploy',
      message: '🚀 Deploy the project using Vercel CLI?',
      initial: true,
    },

  ]);

  return response;
}
