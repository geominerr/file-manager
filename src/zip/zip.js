import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { pipeline } from 'stream/promises';

class CompressionOperation {
  async compress(...args) {
    try {
      const [source, dest] = args;
      const pathToSource = path.resolve(source);
      const pathToDestDir = path.dirname(dest);
      const fileName = path.basename(dest);
      const pathToDest =
        fileName.slice(-3) === '.br'
          ? path.resolve(dest)
          : path.join(pathToDestDir, fileName + '.br');

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
        .catch(() => false);

      if (!isDestDirExist) {
        await fs.promises
          .mkdir(pathToDestDir, { recursive: true })
          .catch((err) => {
            console.error('Error MKDIR: ', err.message);
          });
      }

      await pipeline(
        fs.createReadStream(pathToSource),
        zlib.createBrotliCompress(),
        fs.createWriteStream(pathToDest)
      ).catch((err) => {
        console.error('Error pipeline: ', err.message);
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  async decompress(...args) {
    try {
      const [source, dest] = args;
      const pathToSource = path.resolve(source);
      const pathToDest = path.resolve(dest);
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
        .catch(() => false);

      if (!isDestDirExist) {
        await fs.promises
          .mkdir(pathToDestDir, { recursive: true })
          .catch((err) => {
            console.error('Error MKDIR: ', err.message);
          });
      }

      await pipeline(
        fs.createReadStream(pathToSource),
        zlib.createBrotliDecompress(),
        fs.createWriteStream(pathToDest)
      ).catch((err) => {
        console.error('Error pipeline: ', err.message);
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export default CompressionOperation;
