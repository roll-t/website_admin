import axios from "axios";
import TokenConstants from "../const/token_constants";
import HandleCookie from "../data/cookie/handle_cookie";
import { ApiResponse, ApiResponseError } from "../data/dto/response_types";
import HandleString from "../helper/handle_string";


class ImageApi {

    private static token: string = HandleCookie.getCookie(TokenConstants.Token);

    static handleUpload = async (file: File): Promise<ApiResponse> => {

        if (!file) return ApiResponseError;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://localhost:8080/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${this.token}`
                }
            });

            if (response.status === 200) {
                return response.data as ApiResponse;
            }
            return ApiResponseError;

        } catch (error) {
            return ApiResponseError;
        }
    };

    // API xóa hình ảnh
    static handleDelete = async (publicId: string): Promise<ApiResponse> => {
        try {
            const formatPublicId = HandleString.extractPathFromUrl(publicId).replace(/\//g, '-');
            const response = await axios.delete(`http://localhost:8080/images/delete/${formatPublicId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${this.token}`
                }
            });

            if (response.status === 200) {
                return response.data as ApiResponse;
            }
            return ApiResponseError;
        } catch (error) {
            return ApiResponseError;
        }
    };

}

export default ImageApi;