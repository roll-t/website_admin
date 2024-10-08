"use client"
import BookData from "@/app/lib/data/book_data";
import { BooDataResponse } from "@/app/lib/data/dto/response_types";
import { HandleDateFormat } from "@/app/lib/helper/handle_date_format";
import styles from "@/app/ui/book/add/addBook.module.css";
import Chapter from "@/app/ui/dashboard/chapter/chaper";
import Link from "next/link";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';

const BookDetailPage = ({ params }: any) => {

    const { id } = params;

    const [book, setBook] = useState<BooDataResponse>();
    const [loading, setLoading] = useState(false);
    const fetchBook = async () => {
        setLoading(true);
        try {
            const response = await BookData.getBook(id);
            if (response.code == 0 && response.result != null) {
                const data: BooDataResponse = response.result;
                setBook(data);
                console.log(data)
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBook();
    }, []);

    return (
        <div>
            {
                loading ? <div>Loading</div> :
                    (
                        <div>
                            <div className={styles.wrap}>
                                <div className={`${styles.container} ${styles.boxImage}`}>
                                    <h4>Ảnh bìa </h4>
                                    <div className={styles.bookImage}>
                                        <img className={styles.imageDisplay} src={book?.thumbUrl || "/no_image.jpg"} alt="" />
                                    </div>
                                </div>
                                <div className={styles.container}>
                                    <div>
                                        <h4 className={styles.label}>Thông tin truyện</h4>
                                        <div>
                                            <table className={styles.tableInfo}>
                                                <tbody>
                                                    <tr>
                                                        <td><b>Tên truyện: <span> </span></b></td>
                                                        <td>{book?.name || "Untitle"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><b>Trạng thái: <span> </span></b></td>
                                                        <td>{book?.status || "Unavailable"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><b>Ngày tạo: <span> </span></b></td>
                                                        <td>{HandleDateFormat.dateVN(book?.createdAt ?? "") || "11/09/2024"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><b>Chỉnh sửa: <span> </span></b></td>
                                                        <td>{HandleDateFormat.dateVN(book?.updatedAt ?? "") || "11/09/2024"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><b>Thể loại: <span> </span></b></td>
                                                        <td>
                                                            <div className={styles.boxCategoryDisplay}>
                                                                {
                                                                    book?.categorySlug.map(cat => (
                                                                        <div className={styles.itemCategoryDisplay}>
                                                                            {cat}
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <Link href={"/dashboard/book/edit/" + id}>
                                                <button className={`${styles.button} ${styles.add}`}>
                                                    Chỉnh sửa
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Chapter bookDataId={book?.bookDataId || ""} slug={book?.slug || ""} />
                        </div>
                    )
            }
        </div>
    );
}

export default BookDetailPage;
