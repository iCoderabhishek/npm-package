import { intro, outro } from './utils/logger.js';
import { getUserOptions } from './prompts/getUserOptions.js';
import { generateBaseProject } from './generators/base.js';

const run = async () => {
  intro('✦ Hi, choose your features');

  const baseOptions = await getUserOptions();

  // Only call generateBaseProject now, it handles the folder creation after confirmation
  await generateBaseProject(baseOptions);  

 outro('✔ Done! Happy koding ;)');
};

run();