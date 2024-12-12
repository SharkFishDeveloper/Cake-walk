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
exports.readDependenciesFromPromt = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function readDependenciesFromPromt(language, startPoint) {
    return __awaiter(this, void 0, void 0, function* () {
        let answerDependencies = [];
        switch (language) {
            case 'Typescript':
            case 'Javascript':
            case 'NextJs':
            case 'ReactJs':
                //* <----->
                //* Change it according to every language
                let relativeDirDependencies = yield readPackageJsonForEachDir(startPoint);
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
    });
}
exports.readDependenciesFromPromt = readDependenciesFromPromt;
exports.default = readDependenciesFromPromt;
function readPackageJsonForEachDir(startPoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const parts = startPoint.split('/');
        const subPaths = [];
        const dependencies = [];
        for (let i = 1; i <= parts.length; i++) {
            const subPath = parts.slice(1, i).join('/');
            if (subPath) {
                const fullPath = path_1.default.join(process.cwd(), subPath);
                const isDir = fs_1.default.existsSync(fullPath) && fs_1.default.lstatSync(fullPath).isDirectory();
                if (isDir) {
                    subPaths.push(fullPath);
                    // Check if package.json exists in the directory
                    const packageJsonPath = path_1.default.join(fullPath, 'package.json');
                    if (fs_1.default.existsSync(packageJsonPath)) {
                        // Read the file
                        // console.log("EXISTS",packageJsonPath)
                        const fileData = fs_1.default.readFileSync(packageJsonPath, 'utf-8');
                        const packageJson = JSON.parse(fileData);
                        // Extract dependencies and devDependencies (if they exist)
                        const deps = Object.keys(packageJson.dependencies || {});
                        const devDeps = Object.keys(packageJson.devDependencies || {});
                        // Add them to the dependencies list (without versions)
                        dependencies.push(...deps, ...devDeps);
                    }
                    else {
                        // console.log("DOES NOT EXISTS",packageJsonPath)
                    }
                }
            }
        }
        return dependencies;
    });
}
