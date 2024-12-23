interface Edge{
    'parent':string,
    'child':string,
    'import_name': string;
  }
  interface Graph {
    [key: string]:  { child: string; import_name: string }[];
  }

export {Edge,Graph}