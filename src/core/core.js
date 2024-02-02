import os from 'os';
import process from 'process';
import UserInput from '../user-input/user-input.js';
import Controller from '../controller/controller.js';

class App {
  errorMessage = `Incorrect argument format. Please use the correct syntax:
  npm run start -- --username=your_username
  npm run start -- --username='your username'`;
  variableKey = '--username';
  username = '';

  constructor() {
    this.checkStartArgs();
    this.handleSigint();
    this.controller = new Controller();
    this.userInput = new UserInput(this.username);
  }

  async start() {
    try {
      process.chdir(os.homedir());
      this.showCurrentDirectory();
      this.showHint();
      this.userInput.onInput(this.controller.run());
    } catch (err) {
      console.error(err.message);
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

    console.error(this.errorMessage);
    process.exit(1);
  }

  showGreeting() {
    console.log(`Welcome to the File Manager, ${this.username}!`);
  }

  showHint() {
    console.log(
      `To exit the program, use Ctrl + C or enter '.exit' in the console\nFor a list of available commands, type 'help'.`
    );
  }

  showCurrentDirectory() {
    const currentDir = process.cwd();

    console.log(`You are currently in ${currentDir}`);
  }

  handleSigint() {
    process.on('SIGINT', () => {
      console.log(
        `\nThank you for using File Manager, ${this.username}, goodbye!`
      );
      process.exit(0);
    });
  }
}

export default App;
