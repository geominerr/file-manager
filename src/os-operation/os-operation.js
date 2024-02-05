import os from 'os';
import ErrorHandler from '../utils/handler-error.js';
import Colorant from '../utils/ec-colorant.js';

class OsOperation {
  constructor() {
    this.errorHandler = new ErrorHandler();
    this.colorizer = new Colorant();
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

    console.log(
      this.colorizer.paintResult(`\nDefault system End-Of-Line: ${endOfLine}`)
    );
  }

  cpus() {
    const cpus = os.cpus();
    let message = `\nAmount of CPUs: ${cpus.length}\nDetails:\n`;

    cpus.forEach((core, index) => {
      message += `CPU #${index + 1}, model: ${core.model.trim()}, speed: ${(
        core.speed / 1000
      ).toFixed(1)} GHz\n`;
    });

    console.log(this.colorizer.paintResult(message));
  }

  homedir() {
    console.log(this.colorizer.paintResult(`\nHome directory: ${os.homedir}`));
  }

  username() {
    console.log(
      this.colorizer.paintResult(`\nUsername: ${os.userInfo().username}`)
    );
  }

  architecture() {
    console.log(
      this.colorizer.paintResult(`\nNode.js binary has compiled: ${os.arch}`)
    );
  }
}

export default OsOperation;
