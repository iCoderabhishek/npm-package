import chalk from 'chalk';

export const intro = (msg) => {
  console.log('\n' + chalk.cyan.bold(msg) + '\n');
};

export const outro = (msg) => {
  console.log('\n' + chalk.green.bold(msg) + '\n');
};
