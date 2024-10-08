import axios from "axios";
import TokenConstants from "../const/token_constants";
import HandleCookie from "./cookie/handle_cookie";
import { ChapterRequest } from "./dto/request_types";
import { ApiResponse, ApiResponseError, ChapterResponse } from "./dto/response_types";


class ChapterData {

    private static baseUrl: string = "http://localhost:8080/";

    private static chapterBySlugUrl = (slug: string) => `${this.baseUrl}chapter/book/${slug}`;

    private static chapterByIdUrl = (id: string) => `${this.baseUrl}chapter/${id}`;

    private static chapterUrl: string = `${this.baseUrl}chapter`;

    private static bookDataById = (id: string): string => `${this.chapterBySlugUrl}/${id.toString()}`;


    private static getToken(): string {
        return HandleCookie.getCookie(TokenConstants.Token);
    }

    static async getChapterBySlugBook(slugBook: string): Promise<ChapterResponse[]> {
        try {
            const response = await axios.get(this.chapterBySlugUrl(slugBook), {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.getToken()}`
                },
            });

            let listChapter: ChapterResponse[] = [];

            if (response.status == 200) {
                if (response.data != null) {
                    const dataResponse = response.data as ApiResponse;
                    if (dataResponse.code == 0 && dataResponse.result != null) {
                        listChapter = dataResponse.result as ChapterResponse[];
                    } else {
                        console.log("=============== CALL API FAIL ===================");
                    }
                }
            }
            return listChapter;
        } catch (e) {
            console.error(e);
            return [];
        }
    }



    static async deleteChapter(id: string): Promise<ApiResponse> {
        try {
            let response = await axios.delete(this.chapterByIdUrl(id), {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.getToken()}`
                }
            })
            if (response.status == 200) {
                return response.data as ApiResponse;
            } else {
                return {
                    code: 9999,
                    result: "error"
                };
            }
        } catch (e) {
            return {
                code: 9999,
                result: "error"
            };
        }
    }

    static async getChapterById(chapterId: string): Promise<ApiResponse> {
        try {
            let response = await axios.get(this.chapterByIdUrl(chapterId), {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.getToken()}`
                }
            })
            if (response.status == 200) {
                return response.data as ApiResponse;
            } else {
                return {
                    code: 9999,
                    result: "error"
                };
            }
        } catch (e) {
            return {
                code: 9999,
                result: "error"
            };
        }
    }

    static async createChapter(chapterRequest: ChapterRequest,bid:string): Promise<ApiResponse> {
        try {
            const response = await axios.post(this.chapterByIdUrl(bid), chapterRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.getToken()}`
                },
            })

            if (response.status == 200) {
                return response.data as ApiResponse;
            }
            return ApiResponseError
        } catch (e) {
            return ApiResponseError
        }
    }

    static updateChapter= async (id: string, chapterRequest: ChapterRequest): Promise<ApiResponse> => {
        try {
            const response = await axios.put(this.chapterByIdUrl(id), chapterRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.getToken()}`
                }
            });

            if (response.status === 200) {
                return response.data as ApiResponse;
            }

            return {
                code: 9999,
                result: "error",
            };

        } catch (error) {
            console.error(`Failed to update category with ID: ${id}`, error);
            return {
                code: 9999,
                result: "error",
            };
        }
    }


}

export default ChapterData