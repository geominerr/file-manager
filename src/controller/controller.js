import CommandParser from '../command-parser/command-parser.js';
import FileOperation from '../file-operation/file-operation.js';
import HashCalculator from '../hash/hash.js';
import Navigation from '../navigation/navigation.js';
import OsOperation from '../os-operation/os-operation.js';
import CompressionOperation from '../zip/zip.js';

class Controller {
  constructor() {
    this.commandParser = new CommandParser();
    this.osOperation = new OsOperation();
    this.navigation = new Navigation();
    this.fileOperation = new FileOperation();
    this.hash = new HashCalculator();
    this.zipOperation = new CompressionOperation();
  }

  run() {
    hintMessage = `\nInvalid command or args. Please use 'help' to view a list of available commands.`;
    return async (command) => {
      try {
        const objCommand = this.commandParser.parseCommand(command);

        if (objCommand) {
          const { keyClass, command, args } = objCommand;

          if (!this?.[keyClass]?.[command]) {
            console.error(this.hintMessage);

            return;
          }

          await this[keyClass][command](...args);
        }
      } catch (err) {
        console.error(err);
      }
    };
  }
}

export default Controller;
