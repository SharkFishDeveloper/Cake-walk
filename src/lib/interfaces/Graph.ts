interface Edge{
    'parent':string,
    'child':string,
    'import_name': string;
    'parent_path':string;
  }
  interface Graph {
    [key: string]:  { child: string; import_name: string,parent_path:string }[];
  }

export {Edge,Graph}