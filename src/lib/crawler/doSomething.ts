import path from "path";
import jsRegex from "../regex/javascript";
import fs from "fs";

let regex: RegExp;

export async function doSomething(startfile:string,language:string) {
    switch (language[0]) {
        case 'Typescript':
        case 'Javascript':
        case 'NextJs':
        case 'ReactJs':
            regex = jsRegex;
        }
        readImports(startfile);
}
export async function readImports(startfile:string) {
    try {
        const base_path = path.join(process.cwd(),startfile)
        const file_content = fs.readFileSync(base_path,"utf-8")
        const importsData = [];
        let match;
        while ((match = regex.exec(file_content)) !== null) {
            const imports = match[1];
            const from = match[2];

            if (imports.startsWith('{')) {
              const importsList = imports.replace(/[{}]/g, '').split(',').map(item => item.trim());
              importsList.forEach(imp => {
                importsData.push({ imported: imp, from });
                // console.log(`Imported: ${imp} | From: ${from}`);
              });
            } else {
              importsData.push({ imported: imports, from });
            //   console.log(`Imported: ${imports} | From: ${from}`);
            }
          }
          console.log(importsData);
    } catch (error) {
        
    }
}