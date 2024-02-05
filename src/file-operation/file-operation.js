import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';

class FileOperation {
  // TO DO ERROR HANDLER !!!

  async ls() {
    try {
      const currentPath = this.getCurrentDirectory();
      const files = await fs.promises.readdir(currentPath);
      const table = [];

      for (const file of files) {
        const stats = await fs.promises.stat(path.join(currentPath, file));
        const isFile = stats.isFile();

        const row = {
          Name: file,
          Type: isFile ? 'file' : 'directory',
        };

        table.push(row);
      }

      console.table(table);
    } catch (err) {
      console.error(err);
    }
  }

  async cat(source) {
    try {
      const currentPath = this.getCurrentDirectory();
      const pathToSurce = path.join(currentPath, source);
      const readableStream = fs.createReadStream(pathToSurce, 'utf-8');

      await new Promise((resolve) => {
        readableStream.on('data', (data) => {
          console.log(data);
        });
        readableStream.on('end', () => {
          resolve();
        });
        readableStream.on('error', (err) => {
          console.error(err.message);

          resolve();
        });
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  async add(dest) {
    try {
      const currentPath = this.getCurrentDirectory();
      const pathToDest = path.join(currentPath, dest);

      await fs.promises.writeFile(pathToDest, '');
    } catch (err) {
      console.error(err.message);
    }
  }

  async rn(...args) {
    try {
      const [source, dest] = args;
      const pathToSource = path.resolve(source);
      const sourceDir = path.dirname(pathToSource);
      const pathToDest = path.resolve(sourceDir, dest);

      await fs.promises.rename(pathToSource, pathToDest);
    } catch (err) {
      console.error(err.message);
    }
  }

  async cp(...args) {
    try {
      const [source, dest] = args;
      const pathToSource = path.resolve(source);
      const fileName = path.basename(pathToSource);
      const sourceDir = path.dirname(pathToSource);
      const pathToDestDir = path.resolve(sourceDir, dest);
      const pathToDest = path.join(pathToDestDir, fileName);

      await fs.promises.access(pathToSource).catch(() => {
        throw new Error(`${pathToSource} doesn't exist`);
      });

      const isDestDirExist = await fs.promises
        .access(pathToDestDir)
        .catch(() => false);

      if (!isDestDirExist) {
        await fs.promises
          .mkdir(pathToDestDir, { recursive: true })
          .catch((err) => {
            console.error('Error MKDIR: ', err.message);
          });
      }

      const readableStream = fs.createReadStream(pathToSource);
      const writebaleStream = fs.createWriteStream(pathToDest);

      await pipeline(readableStream, writebaleStream).catch((err) => {
        console.error('Error pipeline: ', err.message);
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  async mv(...args) {
    try {
      const [source] = args;
      const pathToSource = path.resolve(source);

      await this.cp(...args);
      await fs.promises.rm(pathToSource);
    } catch (err) {
      console.error(err.message);
    }
  }

  async rm(source) {
    try {
      const pathToSource = path.resolve(source);

      await fs.promises.rm(pathToSource).catch((err) => {
        throw err;
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  getCurrentDirectory() {
    return process.cwd();
  }
}

export default FileOperation;
