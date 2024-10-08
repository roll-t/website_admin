
export interface CategoryRequest{
    name:string;
    slug:string;
}

export interface BookDataRequest{
    name:string;
    slug:string;
    status:string;
    thumbUrl:string;
    subDocQuyen:boolean;
    categoryId:number[];
    createdAt:string;
    updatedAt:string;
    userId:string
}

export interface BookDataUpdateRequest{
    name:string;
    slug:string;
    status:string;
    thumbUrl:string;
    subDocQuyen:boolean;
    categoryId:number[];
}

export interface LoginRequest{
    email:string,
    password:string
}

export interface ChapterRequest {
    chapterName:string;
    chapterTitle:string;
    chapterContent:string;
}