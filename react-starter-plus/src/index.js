import { intro, outro } from './utils/logger.js';
import { getUserOptions } from './prompts/getUserOptions.js';
import { generateBaseProject } from './generators/base.js';
import { copyBase } from './utils/copyBase.js';
import { setupRouting } from './utils/setupRouting.js'; 
import path from 'path';

const run = async () => {
  intro('🚀 Welcome to React Starter Plus CLI!');

  const baseOptions = await getUserOptions();

  await copyBase(baseOptions);
  await generateBaseProject(baseOptions);

    const root = path.join(process.cwd(), baseOptions.projectName);
    setupRouting(root); 
  

  outro('🎉 Done! Happy hacking!');
};

run();
