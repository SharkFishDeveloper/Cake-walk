export async function parseJsImports(
  file_content: string,
  regex: RegExp,
  proj_dependencies: string[]
) {
  let importsData = [];
  let match;
  // console.log(proj_dependencies)
  while ((match = regex.exec(file_content)) !== null) {
    const imports = match[1];
    const from = match[2];

    // Exclude imports where the "from" is in proj_dependencies
    if (!proj_dependencies.includes(from)) {
      if (imports.startsWith('{')) {
        const importsList = imports
          .replace(/[{}]/g, '')
          .split(',')
          .map((item) => item.trim());
        importsList.forEach((imp) => {
          importsData.push({ imported: imp, from });
        });
      } else {
        importsData.push({ imported: imports, from });
      }
    }
  }
  return importsData;
}
