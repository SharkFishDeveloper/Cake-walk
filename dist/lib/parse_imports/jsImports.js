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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsImports = void 0;
function parseJsImports(file_content, regex, proj_dependencies) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsData = [];
        let match;
        while ((match = regex.exec(file_content)) !== null) {
            const imports = match[1];
            const from = match[2];
            // Exclude imports where the "from" is in proj_dependencies
            if (!proj_dependencies.includes(from)) {
                if (imports.startsWith('{')) {
                    const importsList = imports.replace(/[{}]/g, '').split(',').map(item => item.trim());
                    importsList.forEach(imp => {
                        importsData.push({ imported: imp, from });
                    });
                }
                else {
                    importsData.push({ imported: imports, from });
                }
            }
        }
        return importsData;
    });
}
exports.parseJsImports = parseJsImports;
