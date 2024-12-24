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
exports.checkDependenciesInFile = void 0;
const fs_1 = __importDefault(require("fs"));
function checkDependenciesInFile(importsData, proj_dependencies, regex, parent_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let file_path = parent_path;
        const file_content = fs_1.default.readFileSync(file_path, "utf-8");
        let match;
        while ((match = regex.exec(file_content)) !== null) {
            const imports = match[1];
            const from = match[2];
            if (!proj_dependencies.some(dep => from.startsWith(dep))) {
                if (imports.startsWith('{')) {
                    const importsList = imports
                        .replace(/[{}]/g, '')
                        .split(',')
                        .map((item) => item.trim());
                    importsList.forEach((imp) => {
                        importsData.push({ imported: imp, from });
                    });
                }
                else {
                    importsData.push({ imported: imports, from });
                }
            }
        }
    });
}
exports.checkDependenciesInFile = checkDependenciesInFile;
