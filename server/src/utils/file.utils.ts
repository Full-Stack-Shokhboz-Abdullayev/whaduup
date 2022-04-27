import { unlink } from 'fs';
import { join } from 'path';

export const deleteFromUploads = (fileloc: string, baseUrl: string) => {
  const filename = fileloc.replace(baseUrl, '');
  const filePath = join(__dirname, '..', 'uploads', filename);
  unlink(filePath, (err) => {
    if (err) {
      return console.log('Some error occured: \n', err);
    }
    console.log(`${filename} deleted`);
  });
};
