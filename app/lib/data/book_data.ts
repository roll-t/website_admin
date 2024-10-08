import axios from "axios";
import TokenConstants from "../const/token_constants";
import decodeJWT from "../helper/handle_jwt";
import HandleCookie from "./cookie/handle_cookie";
import { BookDataRequest, BookDataUpdateRequest } from "./dto/request_types";
import { ApiResponse, ApiResponseError, BooDataResponse, JwtResponse } from "./dto/response_types";


class BookData {

    private static baseUrl: string = "http://localhost:8080/";

    private static bookDataUrl: string = `${this.baseUrl}book-data`;

    private static bookCreateUrl = (uid: string): string => `${this.baseUrl}book-data/${uid}`;

    private static bookDataById = (id: string): string => `${this.bookDataUrl}/${id.toString()}`;


    private static getToken(): string {
        return HandleCookie.getCookie(TokenConstants.Token);
    }

    static async getBooks(): Promise<BooDataResponse[]> {
        try {
            const response = await axios.get(this.bookDataUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.getToken()}`
                },
            });

            let listBookData: BooDataResponse[] = [];

            if (response.status == 200) {
                if (response.data != null) {
                    const dataResponse = response.data as ApiResponse;
                    if (dataResponse.code == 0 && dataResponse.result != null) {
                        listBookData = dataResponse.result as BooDataResponse[];
                    } else {
                        console.log("=============== CALL API FAIL ===================");
                    }
                }
            }
            return listBookData;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async createBook(bookDataRequest: BookDataRequest): Promise<ApiResponse> {
        try {
            const jwtObj = decodeJWT(this.getToken());

            const jwtData = jwtObj?.payload as JwtResponse;
            if (jwtData.uid) {
                const response = await axios.post(this.bookCreateUrl(jwtData.uid), bookDataRequest, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${this.getToken()}`
                    },
                })

                if (response.status !== 200) {
                    return {
                        code: 9999,
                        result: "error"
                    }
                }
                const responseData = response.data as ApiResponse;
                return responseData;
            }
            return ApiResponseError;
            
        } catch (e) {
            console.log(e);
            return {
                code: 9999,
                result: "error"
            }
        }
    }

    static async getBook(bid: string): Promise<ApiResponse> {
        console.log(this.getToken())
        try {
            const response = await axios.get(this.bookDataById(bid), {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${this.getToken()}`
                },
            })
            if (response.status == 200) {
                const dataResponse = response.data as ApiResponse;
                return dataResponse;
            }
            return {
                code: 9999,
                result: null
            };
        } catch (e) {
            console.log(e);
            return {
                code: 9999,
                result: null
            };
        }
    }

    static async deleteBookData(id: string): Promise<ApiResponse> {
        try {
            let response = await axios.delete(this.bookDataById(id), {
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

    static updateBook = async (id: string, bookDataRequest: BookDataUpdateRequest): Promise<ApiResponse> => {
        try {
            const response = await axios.put(this.bookDataById(id), bookDataRequest, {
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

export default BookData