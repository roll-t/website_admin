import axios from "axios";
import { CategoryModel } from "../interface/category_model";
import { CategoryRequest } from "./dto/request_types";
import { ApiResponse } from "./dto/response_types";


class Category {
    private static baseUrl: string = "http://localhost:8080/";
    private static categoryUrl: string = `${this.baseUrl}category`;
    private static categoryById = (id: number): string => `${this.categoryUrl}/${id.toString()}`;

    static async getCategories() {
        try {
            const response = await fetch(Category.categoryUrl, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            let listCategory: CategoryModel[] = [];

            if (data.result != null) {
                listCategory = data.result as CategoryModel[];
            }
            return listCategory;
        } catch (e) {
            console.error(e);
        }
    }

    static async createCategory(categoryRequest: CategoryRequest) {
        try {
            const response = await axios.post(this.categoryUrl, categoryRequest, {
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
            let response = await axios.delete(this.categoryById(id))
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
            const response = await axios.put(this.categoryById(id), categoryRequest);

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

export default Category