"use client"
import BookData from "@/app/lib/data/book_data";
import Category from "@/app/lib/data/category";
import { BookDataUpdateRequest } from "@/app/lib/data/dto/request_types";
import { BooDataResponse } from "@/app/lib/data/dto/response_types";
import { BookStatus } from "@/app/lib/enum";
import HandleString from "@/app/lib/helper/handle_string";
import { CategoryModel } from "@/app/lib/interface/category_model";
import styles from "@/app/ui/book/add/addBook.module.css";
import UploadForm from "@/app/ui/dashboard/upload/upload_image";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBookPage = ({ params }: any) => {

    const { id } = params;

    const [book, setBook] = useState<BooDataResponse>();
    const [catItems, setCatItems] = useState<CategoryModel[]>([]);
    const [title, setTitle] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<CategoryModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(""); // Set trạng thái mặc định
    const [titlePre, setTitlePre] = useState("");
    const [statusPre, setStatusPre] = useState("");
    const [imagePre, setImagePre] = useState("");
    const [catPre, setCatPre] = useState<CategoryModel[]>([]);

    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageKey, setImageKey] = useState<number>(0);


    // Xử lý khi thay đổi trạng thái
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value as BookStatus;
        setStatus(newStatus);
    };

    // Fetch categories and book data concurrently
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categories, response] = await Promise.all([Category.getCategories(), BookData.getBook(id)]);

                if (categories) {
                    setCatItems(categories);
                }

                if (response.code == 0 && response.result != null) {
                    const data: BooDataResponse = response.result;
                    setBook(data);
                    setTitle(data.name);
                    setTitlePre(data.name);
                    setStatus(data.status)
                    setStatusPre(data.status)
                    const filterCat = categories?.filter((cat: CategoryModel) =>
                        data.categorySlug.includes(cat.slug)
                    );
                    setSelectedCategory(filterCat ?? []);
                    setImageKey(prevKey => prevKey + 1);
                    setCatPre(filterCat ?? []);
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Handle category selection
    const handleCategorySelect = (category: CategoryModel) => {
        if (selectedCategory.some(item => item.id === category.id)) {
            setSelectedCategory(prev =>
                prev.filter(item => item.id !== category.id)
            );
        } else {
            setSelectedCategory(prev => [...prev, category]);
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (title === "" || selectedCategory.length === 0) {
            toast.error("Vui lòng nhập đủ thông tin");
            return;
        }

        // Check if there are changes in title or selected categories
        if (title !== titlePre || JSON.stringify(selectedCategory) !== JSON.stringify(catPre) || status !== statusPre || imageUrl !== imagePre) {
            const bookData: BookDataUpdateRequest = {
                name: HandleString.capitalizeFirstLetter(title),
                slug: HandleString.generateSlug(title),
                status: status,
                thumbUrl: imageUrl!=""?imageUrl:(book?.thumbUrl??"/no_image.jpg"),
                subDocQuyen: false,
                categoryId: selectedCategory.map(cat => cat.id),
            };

            try {
                const data = await BookData.updateBook(id, bookData);
                if (data.code === 0) {
                    toast.success("Sửa thành công");
                    setTitlePre(title);
                    setCatPre(selectedCategory);
                    setStatusPre(status);
                    setImagePre(imageUrl);
                } else {
                    toast.error("Lỗi không thể sửa");
                }
            } catch (e) {
                toast.error("Có lỗi xảy ra");
            }
        } else {
            toast.warn('Thông tin không có gì thay đổi');
        }
    };

    const handleUploadSuccess = (url: string) => {
        setImageUrl(url); // Cập nhật URL của ảnh
    };

    return (
        <div>
            {
                loading ? <div>loading</div> :
                    (<div className={styles.wrap}>
                        <div className={`${styles.container} ${styles.boxImage}`}>
                            <h4>Sửa ảnh bìa</h4>
                            <div className={styles.boxUploadImage}>
                                {/* Sử dụng key để reset form ảnh */}
                                <UploadForm onUploadSuccess={handleUploadSuccess} currentImage={book?.thumbUrl} key={imageKey} />
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
                                            Trạng thái hiện tại: {status}
                                        </div>
                                        <select name="status" id="status" onChange={handleStatusChange}>
                                            <option value="">Chọn để thay đổi trạng thái</option>
                                            <option value={BookStatus.AVAILABLE}>Có sẳn</option>
                                            <option value={BookStatus.OPENING}>Đang phát hành</option>
                                            <option value={BookStatus.CANCELLED}>Đã hủy</option>
                                            <option value={BookStatus.COMPLETED}>Hoàn thành</option>
                                            <option value={BookStatus.ON_HOLD}>Tạm dừng</option>
                                        </select>
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
                                        <button type="submit">Xác nhận sửa</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>)
            }
        </div>
    );
}

export default EditBookPage;
