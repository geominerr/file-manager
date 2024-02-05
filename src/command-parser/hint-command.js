import { commands } from './commands.js';

export function showAvailableCommands() {
  const keys = Object.keys(commands);

  console.log(`\nAvailable commands:\n`);

  keys.forEach((command) => {
    const args = commands?.[command].args.join(' ');
    let message = `${command} [ ${args} ]`;

    if (!args) {
      message = command;
    }

    console.log(message);
  });
}
