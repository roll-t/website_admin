import ChapterData from "@/app/lib/data/chapter_data";
import { ChapterResponse } from "@/app/lib/data/dto/response_types";
import { HandleDateFormat } from "@/app/lib/helper/handle_date_format";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./chapter.module.css";

interface ChapterModel {
    slug: string;
    bookDataId: string;
}

const Chapter = ({ slug, bookDataId }: ChapterModel) => {
    const [chapters, setChapters] = useState<ChapterResponse[]>([]);

    const handleDelete = async (id: string) => {
        if (confirm("Xác nhận xóa chapter")) {
            const response = await ChapterData.deleteChapter(id);
            if (response.code === 0 && response.result) {
                toast.success("Xóa chapter thành công");
                fetchChapter();
            } else {
                toast.error("Lỗi không thể xóa chapter");
            }
        }
    };

    const fetchChapter = async () => {
        if (slug) {
            const chapters = await ChapterData.getChapterBySlugBook(slug);
            if (chapters.length > 0) {
                setChapters(chapters);
            }
        }
    };

    useEffect(() => {
        fetchChapter();
    }, [slug]);

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <h4>Chapters</h4>
                {bookDataId && (
                    <Link
                        href={{
                            pathname: "/dashboard/book/addChapter/" + bookDataId,
                            query: { chapterCount: chapters.length }, // Passing the chapter length as a query param
                        }}
                    >
                        <button className={`${styles.button} ${styles.add}`}>
                            Thêm chapter
                        </button>
                    </Link>
                )}
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Tên</td>
                        <td>Tiêu đề</td>
                        <td>Ngày thêm</td>
                        <td>Hoạt động</td>
                    </tr>
                </thead>
                <tbody>
                    {chapters.map((chapter) => (
                        <tr key={chapter.chapterId}>
                            <td>{chapter.chapterName || "no name"}</td>
                            <td className={styles.titleCol}>{chapter.chapterTitle || "unTitle"}</td>
                            <td>
                                <p className={styles.des}>
                                    {HandleDateFormat.dateVN(chapter.createAt) || "nothing!"}
                                </p>
                            </td>
                            <td>
                                <div className={styles.btns}>
                                    <button className={`${styles.button} ${styles.view}`}>Chi tiết</button>
                                    <Link href={"/dashboard/book/editChapter/"+chapter.chapterId}>
                                        <button className={`${styles.button} ${styles.edit}`}>
                                            sửa
                                        </button>
                                    </Link>

                                    <button onClick={() => handleDelete(chapter.chapterId)} className={`${styles.button} ${styles.delete}`}>Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Chapter;
