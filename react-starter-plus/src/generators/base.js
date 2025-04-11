import { copyBase } from '../utils/copyBase.js';
import { installReactDeps } from '../utils/setupReact.js';
import { setupTailwind } from '../utils/setupTailwind.js';

export async function generateBaseProject(options) {
  const { projectName, language } = options;

  console.log('📁 copyBase CALLED with:', projectName, language);
  await copyBase({ projectName, language });

  installReactDeps(projectName);
  console.log('⚙️ setupTailwind CALLED with:', projectName, language);
  await setupTailwind({ projectName, language });


}
