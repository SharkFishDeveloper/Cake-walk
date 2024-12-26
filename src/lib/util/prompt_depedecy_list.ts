import path from 'path';
import allDependenciesForJsTs from '../read_dependencies/js';
import fs from 'fs';

export async function readDependenciesFromPromt(
  language: string,
  startPoint: string
) {
  let answerDependencies: string[] = [];
  switch (language) {
    case 'Typescript':
    case 'Javascript':
    case 'NextJs':
    case 'ReactJs':
      //* <----->
      //* Change it according to every language
      let relativeDirDependencies = await readPackageJsonForEachDir(startPoint);
      //* <----->
      answerDependencies = [
        ...relativeDirDependencies,
      ];
  }
  return answerDependencies;
}

export default readDependenciesFromPromt;



async function readPackageJsonForEachDir(startPoint: string): Promise<string[]> {
  const dependencies: string[] = [];

  // Recursive helper function to traverse directories
  function traverseDir(directory: string) {
    if (fs.existsSync(directory) && fs.lstatSync(directory).isDirectory()) {
      // Prevent going into node_modules
      if (directory.includes('node_modules')) return;

      // Check if the directory contains a package.json
      const packageJsonPath = path.join(directory, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        try {
          // Read and parse package.json
          const fileData = fs.readFileSync(packageJsonPath, 'utf-8');
          const packageJson = JSON.parse(fileData);

          // Collect dependencies and devDependencies
          const deps = Object.keys(packageJson.dependencies || {});
          const devDeps = Object.keys(packageJson.devDependencies || {});

          // Append dependencies to the list (only unique values)
          dependencies.push(...deps, ...devDeps);
        } catch (error) {
          console.error(`Failed to read or parse ${packageJsonPath}:`, error);
        }
      }

      // Recursively check subdirectories (skip node_modules)
      const subDirs = fs.readdirSync(directory);
      for (const subDir of subDirs) {
        const fullPath = path.join(directory, subDir);
        if (fs.lstatSync(fullPath).isDirectory()) {
          traverseDir(fullPath);
        }
      }
    }
  }

  // Start traversal from the given starting point
  traverseDir(startPoint);

  // Return unique dependencies (removes duplicates)
  return [...new Set(dependencies)];
}