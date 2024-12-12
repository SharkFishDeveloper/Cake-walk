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
        // ...allDependenciesForJsTs,
        'react',
        'react-dom',
        'react-router-dom',
        ...relativeDirDependencies,
      ];
  }
  return answerDependencies;
}

export default readDependenciesFromPromt;

async function readPackageJsonForEachDir(startPoint: string) {
  const parts = startPoint.split('/');
  const subPaths: string[] = [];
  const dependencies: string[] = [];
  for (let i = 1; i <= parts.length; i++) {
    const subPath = parts.slice(1, i).join('/');
    if (subPath) {
      const fullPath = path.join(process.cwd(), subPath);
      const isDir =
        fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory();

      if (isDir) {
        subPaths.push(fullPath);

        // Check if package.json exists in the directory
        const packageJsonPath = path.join(fullPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          // Read the file
          // console.log("EXISTS",packageJsonPath)
          const fileData = fs.readFileSync(packageJsonPath, 'utf-8');
          const packageJson = JSON.parse(fileData);

          // Extract dependencies and devDependencies (if they exist)
          const deps = Object.keys(packageJson.dependencies || {});
          const devDeps = Object.keys(packageJson.devDependencies || {});

          // Add them to the dependencies list (without versions)
          dependencies.push(...deps, ...devDeps);
        } else {
          // console.log("DOES NOT EXISTS",packageJsonPath)
        }
      }
    }
  }
  return dependencies;
}
