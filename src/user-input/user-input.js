import readline from 'readline';
import { stdin, stdout } from 'process';
import { showAvailableCommands } from '../command-parser/hint-command.js';

class UserInput {
  constructor(username) {
    this.username = username;
    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });

    this.rl.on('SIGINT', () => process.emit('SIGINT'));
  }

  showCurrentDirectory() {
    const currentDir = process.cwd();

    this.rl.output.write(`You are currently in ${currentDir}\n`);
  }

  onInput(callback) {
    return new Promise((resolve) => {
      this.rl.question('\nEnter your command: ', (data) => {
        if (data === '.exit') {
          this.rl.write(
            `Thank you for using File Manager, ${this.username}, goodbye!`
          );
          this.rl.close();
          resolve();

          return;
        }

        if (data === 'help') {
          this.showCurrentDirectory();
          showAvailableCommands();
          resolve();
          this.onInput(callback);

          return;
        }

        this.showCurrentDirectory();
        callback(data.trim()).then(() => {
          resolve();

          this.onInput(callback);
        });
      });
    });
  }
}

export default UserInput;
