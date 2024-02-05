import os from 'os';
import ErrorHandler from '../utils/handler-error.js';

class OsOperation {
  constructor() {
    this.errorHandler = new ErrorHandler();
  }

  os(arg) {
    try {
      this[arg]();
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  eol() {
    const endOfLine = JSON.stringify(os.EOL);

    console.log(`\nDefault system End-Of-Line: ${endOfLine}`);
  }

  cpus() {
    const cpus = os.cpus();
    let message = `\nAmount of CPUs: ${cpus.length}\nDetails:\n`;

    cpus.forEach((core, index) => {
      message += `CPU #${index + 1}, model: ${core.model.trim()}, speed: ${(
        core.speed / 1000
      ).toFixed(1)} GHz\n`;
    });

    console.log(message);
  }

  homedir() {
    console.log(`\nHome directory: ${os.homedir}`);
  }

  username() {
    console.log(`\nUsername: ${os.userInfo().username}`);
  }

  architecture() {
    console.log(`\nNode.js binary has compiled: ${os.arch}`);
  }
}

export default OsOperation;
