interface Edge {
  parent: string;
  child: string;
  import_name: string;
  parent_path: string;
  parent_half_path: string;
  child_full_path: string;
}
interface Graph {
  [key: string]: {
    child: string;
    import_name: string;
    parent_path: string;
    child_full_path: string;
    parent_half_path;
  }[];
}

export { Edge, Graph };
