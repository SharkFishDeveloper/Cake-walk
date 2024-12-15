interface FINAL_ANS_INTERFACE{
    parent_path:string,
    child_path_array:CHILD_ANS_INTERFACE[]
}

interface CHILD_ANS_INTERFACE{
    child_path:string,
    from:string,
    imported:string
}