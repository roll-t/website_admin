


export interface ApiResponse {
    code: number;
    result: any
}

export interface BooDataResponse {
    bookDataId: string;
    name: string;
    slug: string;
    status: string;
    thumbUrl: string;
    subDocQuyen: boolean;
    categorySlug: string[];
    createdAt: string;
    updatedAt: string;
}

export const ApiResponseError: ApiResponse = {
    code: 999,
    result: null
};

export interface TokenResponse {
    token: string,
    authenticated: boolean
}

export interface ChapterResponse{
    chapterId:string;
    chapterName:string;
    chapterTitle:string;
    createAt:string;
    chapterContent:string;
    bookDataId:string;
}

export interface JwtResponse{
    exp:number,
    iat:number,
    iss:string,
    jti:string,
    scope:string,
    sub:string,
    uid:string
}