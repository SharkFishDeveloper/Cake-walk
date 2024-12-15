"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsRegex = /(?:import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]|const\s+([a-zA-Z0-9$_]+)\s*=\s*require\(['"]([^'"]+)['"]\))/g;
exports.default = jsRegex;
