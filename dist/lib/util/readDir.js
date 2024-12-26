"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getFilesInDirectory = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getFilesInDirectory(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let filesList = [];
        // Check if the provided path is a valid directory
        if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
            console.error('Invalid directory path');
            return filesList;
        }
        // Recursive function to read all files in the directory
        const readDirectory = (currentDir, rootDir) => {
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
                }
                else {
                    // If it's a file, add it to the list
                    filesList.push({
                        name: file,
                        short_path: path.relative(rootDir, fullPath), // Relative path to the root directory
                        full_path: fullPath // Full absolute path
                    });
                }
            }
        };
        // Start reading from the provided directory
        readDirectory(dirPath, dirPath);
        return filesList;
    });
}
exports.getFilesInDirectory = getFilesInDirectory;
// Example usage
// getFilesInDirectory('repo').then(files => console.log(files));
