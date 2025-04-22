import prompts from 'prompts';

export async function getUserOptions() {
  const response = await prompts([

    // Project name
    {
      type: 'text',
      name: 'projectName',
      message: '📁 Project name:',
      initial: 'my-react-app',
    },

    // Language selection
    {
      type: 'select',
      name: 'language',
      message: '🧠 Choose language:',
      choices: [
        { title: 'JavaScript', value: 'js' },
        { title: 'TypeScript', value: 'ts' }
      ],
      initial: 0,
    },

    // Git initialization
    {
      type: 'confirm',
      name: 'useGit',
      message: '🧑‍💻 Initialize Git?',
      initial: true,
    },

    // Conditional prompt for pushing to remote GitHub (only if Git is initialized)
    {
      type: (prev) => prev ? 'confirm' : null,
      name: 'pushToRemote',
      message: '🔗 Push to GitHub remote too?',
      initial: false,
    },

    // GitHub Repo URL (only if pushing to remote GitHub)
    {
      type: (prev, values) => values.pushToRemote ? 'text' : null,
      name: 'remoteUrl',
      message: '🌍 GitHub Repo URL:',
    },

    // CI/CD with GitHub Actions
    {
      type: 'confirm',
      name: 'includeCiCd',
      message: '⚙️ Add CI/CD with GitHub Actions?',
      initial: true,
    },

    // Zustand for state management
    {
      type: 'confirm',
      name: 'includeZustand',
      message: '🧠 Add Zustand for state management?',
      initial: false,
    },

    // React Testing Library with Jest
    {
      type: 'confirm',
      name: 'includeTesting',
      message: '🔬 Do you want to include React Testing Library (with Jest)?',
      initial: false,
    },

    // Vercel deployment prompt
    {
      type: 'confirm',
      name: 'vercelDeploy',
      message: '🚀 Deploy the project using Vercel CLI?',
      initial: true,
    },

    // Deploy now prompt (only if Vercel deployment is selected)
    {
      type: (prev, values) => values.vercelDeploy ? 'select' : null,
      name: 'deployNowChoice',
      message: 'Would you like to deploy now?',
      choices: [
        { title: 'Yes, deploy now', value: 'yes' },
        { title: 'No, deploy later', value: 'no' },
      ],
    },

  ]);

  return response;
}
