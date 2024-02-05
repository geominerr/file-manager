import path from 'path';
import ErrorHandler from '../utils/handler-error.js';
import Colorant from '../utils/ec-colorant.js';

class Navigation {
  errorMessage = '\nYou are already in the root directory of the drive.';

  constructor() {
    this.errorHandler = new ErrorHandler();
    this.colorant = new Colorant();
  }

  async up() {
    try {
      const currentPath = process.cwd();
      const currentDriveRoot = path.parse(currentPath).root;
      const nextPath = path.resolve(currentPath, '..');

      if (currentPath !== currentDriveRoot) {
        return process.chdir(nextPath);
      }

      throw new Error(this.errorMessage);
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  async cd(newPath) {
    try {
      const currentPath = process.cwd();
      const currentDriveRoot = path.parse(currentPath).root;
      const nextPath = path.resolve(currentPath, newPath);

      if (path.isAbsolute(newPath) && currentPath !== currentDriveRoot) {
        return process.chdir(newPath);
      } else if (nextPath !== currentPath) {
        return process.chdir(nextPath);
      }

      throw new Error(this.errorMessage);
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }
}

export default Navigation;
