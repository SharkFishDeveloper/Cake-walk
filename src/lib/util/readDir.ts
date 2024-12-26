import * as fs from 'fs';
import * as path from 'path';

interface FileInfo {
  name: string;
  short_path: string;
  full_path: string;
}

export async function getFilesInDirectory(
  dirPath: string
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
      const fullPath = path.resolve(currentDir, file); // Use path.resolve for full absolute path
      const stat = fs.lstatSync(fullPath);

      // Exclude .git and package.json
      if (file === 'package.json' || file === '.git') {
        continue;
      }

      // If it's a directory, recurse into it
      if (stat.isDirectory()) {
        readDirectory(fullPath, rootDir);
      } else {
        // If it's a file, add it to the list
        filesList.push({
          name: file,
          short_path: path.relative(rootDir, fullPath), // Relative path to the root directory
          full_path: fullPath, // Full absolute path
        });
      }
    }
  };

  // Start reading from the provided directory
  readDirectory(dirPath, dirPath);

  return filesList;
}

// Example usage
// getFilesInDirectory('repo').then(files => console.log(files));
