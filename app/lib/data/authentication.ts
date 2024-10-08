import axios from "axios";
import TokenConstants from "../const/token_constants";
import HandleCookie from "./cookie/handle_cookie";
import { CategoryRequest, LoginRequest } from "./dto/request_types";
import { ApiResponse, ApiResponseError } from "./dto/response_types";


class Authentication {
    
    private static baseUrl: string = "http://localhost:8080/";
    private static userUrl: string = `${this.baseUrl}user`;
    private static tokenUrl: string = `${this.baseUrl}auth/token`;
    private static userById = (id: number): string => `${this.userUrl}/${id.toString()}`;

    static async login(loginRequest: LoginRequest): Promise<ApiResponse> {
        try {
            const response = await axios.post(this.tokenUrl, loginRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.status == 200) {
                return response.data as ApiResponse;
            }
            return ApiResponseError;

        } catch (e) {
            return ApiResponseError;
        }
    }
    static checkLogin = (): boolean => {
        try {
            const token = HandleCookie.getCookie(TokenConstants.Token);
            return token != "";
        } catch (e) {
            return false;
        }
    }

    static logout = (): boolean => {
        try {
            HandleCookie.deleteCookie(TokenConstants.Token);
            return true;
        } catch (e) {
            return false;
        }
    }

    static async createCategory(categoryRequest: CategoryRequest) {
        try {
            const response = await axios.post(this.userUrl, categoryRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Xử lý phản hồi nếu cần
            console.log('Category created:', response.data);
        } catch (e) {
            console.log(e);
        }
    }

    static async deleteCategory(id: number): Promise<ApiResponse> {
        try {
            let response = await axios.delete(this.userById(id))
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

    static updateCategory = async (id: number, categoryRequest: CategoryRequest): Promise<ApiResponse> => {
        try {
            const response = await axios.put(this.userById(id), categoryRequest);

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

export default Authentication