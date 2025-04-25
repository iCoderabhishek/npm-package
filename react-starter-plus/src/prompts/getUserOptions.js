import prompts from 'prompts';

export async function getUserOptions() {
  const response = await prompts([

    // Project name
    {
      type: 'text',
      name: 'projectName',
      message: '◇ Project name »',
      initial: 'my-react-app',
    },

    // Language selection
    {
      type: 'select',
      name: 'language',
      message: '◇ Choose language »',
      choices: [
        { title: 'JavaScript', value: 'js' },
        { title: 'TypeScript', value: 'ts' }
      ],
      initial: 0,
    },

    // Git initialization
    {
      type: 'select',
      name: 'useGit',
      message: '◇ Initialize Git repository? »',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 0,
    },

    // Push to remote
    {
      type: (prev) => prev ? 'select' : null,
      name: 'pushToRemote',
      message: '◇ Push to GitHub remote? »',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 1,
    },

    // Remote URL
    {
      type: (prev, values) => values.pushToRemote ? 'text' : null,
      name: 'remoteUrl',
      message: '◇ GitHub Remote URL »',
    },

    // CI/CD
    {
      type: 'select',
      name: 'includeCiCd',
      message: '✦ Add CI/CD with GitHub Actions? »',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 0,
    },

    // Zustand
    {
      type: 'select',
      name: 'includeZustand',
      message: '✦ Add Zustand for state management? »',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 1,
    },

    // Testing
    {
      type: 'select',
      name: 'includeTesting',
      message: '✦ Include React Testing Library (Jest)? »',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 1,
    },

    // Vercel deploy
    {
      type: 'select',
      name: 'vercelDeploy',
      message: '✦ Deploy using Vercel CLI? »',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 0,
    },

    // Deploy now
    {
      type: (prev, values) => values.vercelDeploy ? 'select' : null,
      name: 'deployNowChoice',
      message: '⧗ ✓ Do you want to deploy now or later? »',
      choices: [
        { title: 'Yes, deploy now', value: 'yes' },
        { title: 'No, deploy later', value: 'no' },
      ],
    },

  ]);

  return response;
}
