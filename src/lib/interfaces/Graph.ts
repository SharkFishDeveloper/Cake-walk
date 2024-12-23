interface Edge{
    'parent':string,
    'child':string,
    'import_name': string;
  }
  interface Graph {
    [key: string]: string[];
  }

export {Edge,Graph}