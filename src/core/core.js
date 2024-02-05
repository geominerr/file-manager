import os from 'os';
import process from 'process';
import UserInput from '../user-input/user-input.js';
import Controller from '../controller/controller.js';
import ErrorHandler from '../utils/handler-error.js';
import Colorant from '../utils/ec-colorant.js';

class App {
  errorMessage = `Incorrect argument format. Please use the correct syntax:
  npm run start -- --username=your_username
  npm run start -- --username='your username'`;
  hintMessage = `To exit the program, use Ctrl + C or enter '.exit' in the console\nFor a list of available commands, type 'help'.\nPlease use either 'single' or "double" quotes for paths containing spaces`;
  variableKey = '--username';
  username = '';

  constructor() {
    this.colorizer = new Colorant();
    this.checkStartArgs();
    this.handleSigint();
    this.controller = new Controller();
    this.userInput = new UserInput(this.username);
    this.errorHandler = new ErrorHandler();
  }

  async start() {
    try {
      process.chdir(os.homedir());
      this.showHint();
      this.showCurrentDirectory();
      this.userInput.onInput(this.controller.run());
    } catch (err) {
      this.errorHandler.handle(err);
      process.exit(1);
    }
  }

  checkStartArgs() {
    const args = process.argv.slice(2);

    if (args.length === 1) {
      const entrie = args[0].split('=');

      if (entrie[0] === this.variableKey && entrie.length === 2) {
        this.username = entrie[1];
        this.showGreeting();

        return;
      }
    }

    console.error(this.colorizer.paintError(this.errorMessage));
    process.exit(1);
  }

  showGreeting() {
    console.log(
      this.colorizer.paintHint(
        `Welcome to the File Manager, ${this.colorizer.paintUsername(
          this.username
        )}!`
      )
    );
  }

  showHint() {
    console.log(this.colorizer.paintHint(this.hintMessage));
  }

  showCurrentDirectory() {
    const currentDir = process.cwd();

    console.log(
      this.colorizer.paintCurrDir(`You are currently in ${currentDir}`)
    );
  }

  handleSigint() {
    process.on('SIGINT', () => {
      console.log(
        this.colorizer.paintFarewell(
          `\nThank you for using File Manager, ${this.colorizer.paintUsername(
            `${this.username}, goodbye! `
          )}`
        )
      );
      process.exit(0);
    });
  }
}

export default App;
