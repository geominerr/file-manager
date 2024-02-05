import readline from 'readline';
import { stdin, stdout } from 'process';
import { showAvailableCommands } from '../command-parser/hint-command.js';
import ErrorHandler from '../utils/handler-error.js';
import Colorant from '../utils/ec-colorant.js';

class UserInput {
  constructor(username) {
    this.errorHandler = new ErrorHandler();
    this.username = username;
    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
    this.colorizer = new Colorant();
    this.promptMessage = this.colorizer.paintPrompt('\nEnter your command: ');
    this.rl.on('SIGINT', () => process.emit('SIGINT'));
  }

  showCurrentDirectory() {
    const currentDir = process.cwd();

    this.rl.output.write(
      this.colorizer.paintCurrDir(`You are currently in ${currentDir}\n`)
    );
  }

  onInput(callback) {
    return new Promise((resolve) => {
      this.rl.question(this.promptMessage, (data) => {
        if (data === '.exit') {
          this.rl.write(
            this.colorizer.paintFarewell(
              `Thank you for using File Manager, ${this.colorizer.paintUsername(
                `${this.username}, goodbye!`
              )}`
            )
          );
          this.rl.close();
          resolve();

          return;
        }

        if (data === 'help') {
          showAvailableCommands();
          resolve();
          this.showCurrentDirectory();
          this.onInput(callback);

          return;
        }

        callback(data.trim()).then(() => {
          resolve();
          this.showCurrentDirectory();
          this.onInput(callback);
        });
      });
    }).catch((err) => this.errorHandler.handle(err));
  }
}

export default UserInput;
