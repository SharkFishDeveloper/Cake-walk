import * as fs from 'fs';
import * as path from 'path';

interface FileInfo {
  name: string;
  short_path: string;
  full_path: string;
  last_directory: string;
}

export async function getFilesInDirectory(
  dirPath: string,
  dirTag: string,
  excludeFolders: string[] // Array of folder or file names to exclude
): Promise<FileInfo[]> {
  let filesList: FileInfo[] = [];

  // Check if the provided path is a valid directory
  if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
    console.error('Invalid directory path');
    return filesList;
  }

  // Recursive function to read all files in the directory
  const readDirectory = (currentDir: string, rootDir: string) => {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const fullPath = path.resolve(currentDir, file);
      const stat = fs.lstatSync(fullPath);

      // Check if the current file/folder should be excluded
      if (excludeFolders.includes(file)) {
        continue;
      }

      if (stat.isDirectory()) {
        // Recursively process the directory if not excluded
        readDirectory(fullPath, rootDir);
      } else {
        // Add the file to the list
        filesList.push({
          name: file,
          short_path: path.join(dirPath, path.relative(rootDir, fullPath)),
          full_path: fullPath,
          last_directory: path.basename(path.dirname(fullPath)),
        });
      }
      // console.log(dirTag, rootDir, fullPath);
    }
  };

  // Start reading from the provided directory
  readDirectory(dirPath, dirPath);

  return filesList;
}
