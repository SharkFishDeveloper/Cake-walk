interface FINAL_VIEW_INTERFACE{
    parent_path:string,
    parent_full_path:string,
    full_path_child:string,
    half_path_child:string
}


type ImportsMap = {
    [key: string]: FINAL_VIEW_INTERFACE[];
};