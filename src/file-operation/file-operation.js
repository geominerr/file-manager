import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import ErrorHandler from '../utils/handler-error.js';

class FileOperation {
  constructor() {
    this.errorHandler = new ErrorHandler();
  }

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
      this.errorHandler.handle(err);
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
          this.errorHandler.handle(err);

          resolve();
        });
      });
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  async add(dest) {
    try {
      const currentPath = this.getCurrentDirectory();
      const pathToDest = path.join(currentPath, dest);

      await fs.promises.writeFile(pathToDest, '');
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  async rn(...args) {
    try {
      const [source, dest] = args;
      const pathToSource = path.resolve(source);
      const sourceDir = path.dirname(pathToSource);
      const pathToDest = path.join(sourceDir, dest);

      await fs.promises.rename(pathToSource, pathToDest);
    } catch (err) {
      this.errorHandler.handle(err);
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
            throw err;
          });
      }

      await pipeline(
        fs.createReadStream(pathToSource),
        fs.createWriteStream(pathToDest)
      ).catch((err) => {
        throw err;
      });
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  async mv(...args) {
    try {
      const [source] = args;
      const pathToSource = path.resolve(source);

      await this.cp(...args);
      await fs.promises.rm(pathToSource);
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  async rm(source) {
    try {
      const pathToSource = path.resolve(source);

      await fs.promises.rm(pathToSource).catch((err) => {
        throw err;
      });
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  getCurrentDirectory() {
    return process.cwd();
  }
}

export default FileOperation;
