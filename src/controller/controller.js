import CommandParser from '../command-parser/command-parser.js';
import FileOperation from '../file-operation/file-operation.js';
import HashCalculator from '../hash/hash.js';
import Navigation from '../navigation/navigation.js';
import OsOperation from '../os-operation/os-operation.js';
import ErrorHandler from '../utils/handler-error.js';
import CompressionOperation from '../zip/zip.js';

class Controller {
  hintMessage = `\nInvalid command or args. Please use 'help' to view a list of available commands.`;

  constructor() {
    this.commandParser = new CommandParser();
    this.osOperation = new OsOperation();
    this.navigation = new Navigation();
    this.fileOperation = new FileOperation();
    this.hash = new HashCalculator();
    this.zipOperation = new CompressionOperation();
    this.errorHandler = new ErrorHandler();
  }

  run() {
    return async (command) => {
      try {
        const objCommand = this.commandParser.parseCommand(command);

        if (objCommand) {
          const { keyClass, command, args } = objCommand;

          if (!this?.[keyClass]?.[command]) {
            throw new Error(this.hintMessage);
          }

          await this[keyClass][command](...args);
        }
      } catch (err) {
        this.errorHandler.handle(err);
      }
    };
  }
}

export default Controller;
