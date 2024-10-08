"use client"
import ImageApi from "@/app/lib/api/image_api";
import BookData from "@/app/lib/data/book_data";
import { BooDataResponse } from "@/app/lib/data/dto/response_types";
import { HandleDateFormat } from "@/app/lib/helper/handle_date_format";
import styles from "@/app/ui/book/book.module.css";
import Loading from "@/app/ui/dashboard/loading/loading";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface BookPageProps {
    addFunction?: boolean
}

const BookPage = ({ addFunction = true }: BookPageProps) => {

    const [booksData, setBooksData] = useState<BooDataResponse[]>([]);
    const [loading, setLoading] = useState(true)

    const fetchBooksData = async () => {
        setLoading(true);
        try {
            const listBookData = await BookData.getBooks();
            setBooksData(listBookData)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBooksData();
    }, []);


    const handleDeleteBook = async (bid: string, imageUrl: string) => {
        setLoading(true);
        const allow = confirm("Bạn có chắc muốn xóa sách này?");
        if (allow) {
            const response = await BookData.deleteBookData(bid);
            await ImageApi.handleDelete(imageUrl)
            if (response.code == 0) {
                if(response.result){
                    toast.success("Xóa sách thành công")
                    fetchBooksData();
                }else{
                    toast.error("Truyện đang chứa chapter không thể xóa")
                }
            } else {
                toast.error("Lỗi không thể xóa");
            }
        }
        setLoading(false)
    };

    return (
        <div className={styles.container}>
            {
                addFunction &&
                (<div className={styles.head}>
                    <div></div>
                    <Link href={"/dashboard/book/add"}>
                        <button className={`${styles.button} ${styles.add}`}>
                            Thêm sách
                        </button>
                    </Link>
                </div>)
            }
            {
                loading ? (
                    <div><Loading /></div>
                ) : (<table className={styles.table}>
                    <thead>
                        <tr>
                            <td>Bìa</td>
                            <td>Tiêu đề</td>
                            <td>Trạng thái</td>
                            <td>Cập nhật</td>
                            <td>Hoạt động</td>
                        </tr>
                    </thead>
                    <tbody>
                        {booksData.length > 0 ? (
                            booksData.map((book, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className={styles.bookCover}>
                                            <img src={book.thumbUrl || "/product.png "} alt="" width={60} height={70} />
                                        </div>
                                    </td>
                                    <td className={styles.titleCol}>
                                        {book.name || "Untitled"}
                                    </td>
                                    <td>
                                        {book.status}
                                    </td>

                                    <td>
                                        {HandleDateFormat.dateVN(book.updatedAt)}
                                    </td>
                                    <td>
                                        <div className={styles.btns}>
                                            <Link href={"/dashboard/book/" + book.bookDataId}>
                                                <button
                                                    className={`${styles.button} ${styles.view}`}
                                                >
                                                    Chi tiết
                                                </button>
                                            </Link>
                                            <Link href={"/dashboard/book/edit/" + book.bookDataId}>
                                                <button
                                                    className={`${styles.button} ${styles.edit}`}
                                                >
                                                    sửa
                                                </button>
                                            </Link>
                                            <button
                                                className={`${styles.button} ${styles.delete}`}
                                                onClick={() => handleDeleteBook(book.bookDataId, book.thumbUrl)}
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
        </div>
    );
}

export default BookPage;