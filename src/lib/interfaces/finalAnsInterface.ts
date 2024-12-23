interface FINAL_VIEW_INTERFACE {
  half_parent_path: string;
  full_parent_path: string;
  half_path_child: string;
  full_path_child: string;
}

type ImportsMap = {
  [key: string]: FINAL_VIEW_INTERFACE[];
};
