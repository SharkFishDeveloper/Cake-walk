const jsRegex = /(?:import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]|const\s+([a-zA-Z0-9$_]+)\s*=\s*require\(['"]([^'"]+)['"]\))/g;

// /(?:import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]|const\s+([a-zA-Z0-9$_]+)\s*=\s*require\(['"]([^'"]+)['"]\))/g;


export default jsRegex;