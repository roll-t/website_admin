"use client"
import BookData from "@/app/lib/data/book_data";
import Category from "@/app/lib/data/category";
import { BookDataRequest } from "@/app/lib/data/dto/request_types";
import HandleString from "@/app/lib/helper/handle_string";
import { CategoryModel } from "@/app/lib/interface/category_model";
import styles from "@/app/ui/book/add/addBook.module.css";
import UploadForm from "@/app/ui/dashboard/upload/upload_image";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookPage from "../page";


import 'react-toastify/dist/ReactToastify.css';

const AddBookPage = () => {
    const [catItems, setCatItems] = useState<CategoryModel[]>([]);
    const [title, setTitle] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<CategoryModel[]>([]);
    const [refresh, setRefresh] = useState(0);
    const [imageUrl, setImageUrl] = useState<string>("");

    // State để điều khiển key của UploadForm
    const [imageKey, setImageKey] = useState<number>(0);

    const fetchCategories = async () => {
        try {
            const categories = await Category.getCategories();
            if (categories != null) {
                setCatItems(categories);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => { fetchCategories() }, []);

    const handleCategorySelect = (category: CategoryModel) => {
        if (selectedCategory.some(item => item.id === category.id)) {
            setSelectedCategory(prev => prev.filter(item => item.id !== category.id));
        } else {
            setSelectedCategory(prev => [...prev, category]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (title === "" || selectedCategory.length === 0) {
            toast.error("Vui lòng nhập đủ thông tin");
            return;
        }

        const bookData: BookDataRequest = {
            name: HandleString.capitalizeFirstLetter(title),
            slug: HandleString.generateSlug(title),
            status: 'AVAILABLE',
            thumbUrl: imageUrl,
            subDocQuyen: false,
            categoryId: selectedCategory.map(cat => cat.id),
            createdAt: '',
            updatedAt: '',
            userId:""
        };

        try {
            const data = await BookData.createBook(bookData);
            if (data.code === 0) {
                toast.success("Thêm thành công");
                setTitle("");
                setSelectedCategory([]);
                setImageUrl("");
                setRefresh(prev => prev + 1);
                setImageKey(prevKey => prevKey + 1); // Thay đổi key để reset form ảnh
            } else {
                toast.error("Lỗi không thể thêm");
            }
        } catch (e) {
            toast.error("Có lỗi xảy ra");
        }
    };

    const handleUploadSuccess = (url: string) => {
        setImageUrl(url); // Cập nhật URL của ảnh
    };

    return (
        <div>
            <div className={styles.wrap}>
                <div className={`${styles.container} ${styles.boxImage}`}>
                    <h4>Thêm ảnh bìa</h4>
                    <div className={styles.boxUploadImage}>
                        {/* Sử dụng key để reset form ảnh */}
                        <UploadForm onUploadSuccess={handleUploadSuccess} key={imageKey} />
                    </div>
                </div>
                <div className={styles.container}>
                    <div>
                        <h4 className={styles.label}>Thông tin truyện</h4>
                        <div>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <input
                                    type="text"
                                    placeholder="Nhập tên truyện"
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                    required
                                />
                                <div>
                                    <h4 className={styles.label}>Chọn danh mục truyện</h4>
                                    <div className={styles.boxCategorySelect}>
                                        {catItems.map((catItem) => (
                                            <div
                                                key={catItem.id}
                                                className={`${styles.boxCategoryItems} ${selectedCategory.some(item => item.id === catItem.id) ? styles.selectedCategory : ''}`}
                                                onClick={() => handleCategorySelect(catItem)}
                                                style={{ backgroundColor: selectedCategory.some(item => item.id === catItem.id) ? 'green' : 'transparent' }}
                                            >
                                                {catItem.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit">Xác nhận thêm</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <BookPage addFunction={false} key={refresh.toString()} />
        </div>
    );
}

export default AddBookPage;
