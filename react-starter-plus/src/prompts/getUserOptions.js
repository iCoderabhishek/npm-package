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
    }
  ]);

  return response;
}
