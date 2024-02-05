import crypto from 'crypto';
import path from 'path';

import fs from 'fs';
import { promises } from 'dns';

class HashCalculator {
  errorMessage = `The specified path does not point to a file; it is a directory.`;
  hashAlgorшthm = 'sha256';

  async hash(source) {
    try {
      const pathToSource = path.resolve(source);
      const hash = crypto.createHash(this.hashAlgorшthm);

      const isFile = await fs.promises
        .stat(pathToSource)
        .then((stat) => {
          if (!stat.isFile()) {
            throw new Error(this.errorMessage);
          }

          return true;
        })
        .catch((err) => {
          throw err;
        });

      if (isFile) {
        return await new Promise((resolve) => {
          fs.createReadStream(pathToSource)
            .on('data', (data) => {
              hash.update(data);
            })
            .on('end', () => {
              console.log(`SHA-256 hash: ${hash.digest('hex')}`);
              resolve();
            })
            .on('error', (err) => {
              resolve();
              throw err;
            });
        }).catch((err) => {
          throw err;
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}

export default HashCalculator;
