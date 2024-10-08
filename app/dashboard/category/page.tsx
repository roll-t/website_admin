"use client"
import Category from "@/app/lib/data/category";
import { ApiResponse } from "@/app/lib/data/dto/response_types";
import { CategoryModel } from "@/app/lib/interface/category_model";
import styles from "@/app/ui/category/category.module.css";
import ModalCategory from "@/app/ui/dashboard/modal/modal_category";
import ModelEditCategory from "@/app/ui/dashboard/modal/model_edit_category";
import Search from "@/app/ui/dashboard/search/search";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';

const CategoryPage = () => {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [loading, setLoading] = useState(true)

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await Category.getCategories();
            setCategories(data ?? []);
        } catch (e) {
            console.error("Error fetching categories:", e);
            toast.error("Lỗi khi tải danh mục.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const showToast = (type: "success" | "error" | "warning", message: string) => {
        toast[type](message);
    };

    const handleCategoryAction = async (action: () => Promise<ApiResponse>, successMessage: string, failureMessage: string) => {
        try {
            const response = await action();
            if (response.code === 0 && response.result) {
                showToast("success", successMessage);
                fetchCategories();
            } else {
                showToast("error", failureMessage);
            }
        } catch (e) {
            console.error(failureMessage, e);
            showToast("error", failureMessage);
        }
    };

    const handleDeleteCategory = (id: number) => {
        const allow = confirm("Bạn có chắc muốn xóa danh mục?");
        if (allow) {
            handleCategoryAction(
                () => Category.deleteCategory(id),
                "Xóa danh mục thành công",
                "Lỗi không thể xóa được danh mục"
            );
        }
    };

    const handleCategoryAdded = (success: boolean) => {
        if (success) {
            showToast("success", "Thêm danh mục thành công");
            fetchCategories();
        } else {
            showToast("error", "Lỗi thêm danh mục");
        }
    };

    const handleCategoryUpdate = (success: boolean) => {
        if (success) {
            showToast("success", "Sửa danh mục thành công");
            fetchCategories();
        } else {
            showToast("error", "Lỗi sửa danh mục");
        }
    };

    const handleSearch = (query: string) => {
        console.log("Search query:", query);
    };

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <Search onSearch={handleSearch} />
                <ModalCategory onCategoryAdded={handleCategoryAdded} />
            </div>
            {
                loading ? (
                    <div>Loading</div>
                ) : (<table className={styles.table}>
                    <thead>
                        <tr>
                            <td>Danh mục</td>
                            <td>Hoạt động</td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <tr key={index}>
                                    <td className={styles.titleCol}>
                                        {category.name || "Untitled"}
                                    </td>
                                    <td>
                                        <div className={styles.btns}>
                                            <ModelEditCategory
                                                currentName={category.name}
                                                id={category.id}
                                                onCategoryUpdate={handleCategoryUpdate}
                                            />
                                            <button
                                                className={`${styles.button} ${styles.delete}`}
                                                onClick={() => handleDeleteCategory(category.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2}>Không có danh mục nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>)
            }
            <ToastContainer />
        </div>
    );
};

export default CategoryPage;
