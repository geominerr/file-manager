import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { pipeline } from 'stream/promises';
import ErrorHandler from '../utils/handler-error.js';

class CompressionOperation {
  errorMessage = '\n The specified path is a directory, not a file.';

  constructor() {
    this.errorHandler = new ErrorHandler();
  }

  async compress(...args) {
    try {
      const [source, dest] = args;
      const pathToSource = path.resolve(source);
      const pathToDestDir = path.resolve(dest);
      const fileName = path.basename(pathToSource);
      const pathToDest = path.join(pathToDestDir, fileName + '.br');

      await fs.promises
        .stat(pathToSource)
        .then((stat) => {
          if (!stat.isFile()) {
            throw new Error(this.errorMessage);
          }
        })
        .catch((err) => {
          throw err;
        });

      const isDestDirExist = await fs.promises
        .access(pathToDestDir)
        .catch((err) => {
          if (err.code === 'ENOENT') {
            return false;
          }

          throw err;
        });

      if (!isDestDirExist) {
        await fs.promises
          .mkdir(pathToDestDir, { recursive: true })
          .catch((err) => {
            throw err;
          });
      }

      await pipeline(
        fs.createReadStream(pathToSource),
        zlib.createBrotliCompress(),
        fs.createWriteStream(pathToDest)
      ).catch((err) => {
        throw err;
      });
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  async decompress(...args) {
    try {
      const [source, dest] = args;
      const pathToSource = path.resolve(source);
      const fileName = path.basename(pathToSource);
      const pathToDest = path.join(dest, fileName);
      const pathToDestDir = path.dirname(pathToDest);

      await fs.promises
        .stat(pathToSource)
        .then((stat) => {
          if (!stat.isFile()) {
            throw new Error(this.errorMessage);
          }
        })
        .catch((err) => {
          throw err;
        });

      const isDestDirExist = await fs.promises
        .access(pathToDestDir)
        .catch((err) => {
          if (err.code === 'ENOENT') {
            return false;
          }

          throw err;
        });

      if (!isDestDirExist) {
        await fs.promises
          .mkdir(pathToDestDir, { recursive: true })
          .catch((err) => {
            throw err;
          });
      }

      await pipeline(
        fs.createReadStream(pathToSource),
        zlib.createBrotliDecompress(),
        fs.createWriteStream(pathToDest)
      ).catch((err) => {
        throw err;
      });
    } catch (err) {
      this.errorHandler.handle(err);
      console.log(err);
    }
  }
}

export default CompressionOperation;
