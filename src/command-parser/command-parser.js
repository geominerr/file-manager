import { commands } from './commands.js';

class CommandParser {
  hintMessage = `\nInvalid command or args. Please use 'help' to view a list of available commands.`;

  constructor() {
    this.commands = commands;
  }

  parseCommand(data) {
    const parsedData = data.split(' ');
    const command = parsedData[0];
    const args = [...parsedData.slice(1)];

    if (!this.commands?.[command]) {
      this.showHint();

      return;
    }

    const isOsOperation = command === 'os';
    const commandArgs = this.commands[command].args;

    if (
      (isOsOperation && args.length === 1 && commandArgs.includes(args[0])) ||
      commandArgs.length === args.length
    ) {
      return {
        keyClass: this.commands[command].keyClass,
        command: command,
        args: args[0]?.startsWith('--')
          ? [args[0].slice(2).toLowerCase()]
          : args,
      };
    }

    this.showHint();
  }

  showHint() {
    console.log(this.hintMessage);
  }
}

export default CommandParser;
