import path from 'path';

class Navigation {
  rootDirectoryMessage =
    '\nOperation failed! You are already in the root directory of the drive.';
  doesntExistsMessage =
    '\nThe path does not exist, please check the input for correctness.';

  async up() {
    try {
      const currentPath = process.cwd();
      const currentDriveRoot = path.parse(currentPath).root;
      const nextPath = path.resolve(currentPath, '..');

      if (currentPath !== currentDriveRoot) {
        return process.chdir(nextPath);
      }

      console.error(this.rootDirectoryMessage);
    } catch (err) {
      console.error(err.message);
    }
  }

  async cd(newPath) {
    console.log(newPath);
    try {
      if (path.isAbsolute(newPath)) {
        return process.chdir(newPath);
      }

      const currentPath = process.cwd();
      const nextPath = path.join(currentPath, newPath);

      process.chdir(newPath);
    } catch (err) {
      console.error(this.doesntExistsMessage);
    }
  }
}

export default Navigation;
