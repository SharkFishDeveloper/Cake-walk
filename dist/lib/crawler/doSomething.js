"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readImports = exports.doSomething = void 0;
const path_1 = __importDefault(require("path"));
const javascript_1 = __importDefault(require("../regex/javascript"));
const fs_1 = __importDefault(require("fs"));
let regex;
function doSomething(startfile, language) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (language[0]) {
            case 'Typescript':
            case 'Javascript':
            case 'NextJs':
            case 'ReactJs':
                regex = javascript_1.default;
        }
        readImports(startfile);
    });
}
exports.doSomething = doSomething;
function readImports(startfile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const base_path = path_1.default.join(process.cwd(), startfile);
            const file_content = fs_1.default.readFileSync(base_path, "utf-8");
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
                }
                else {
                    importsData.push({ imported: imports, from });
                    //   console.log(`Imported: ${imports} | From: ${from}`);
                }
            }
            console.log(importsData);
        }
        catch (error) {
        }
    });
}
exports.readImports = readImports;
