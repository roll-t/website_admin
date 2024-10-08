"use client";
import BookData from "@/app/lib/data/book_data";
import ChapterData from "@/app/lib/data/chapter_data";
import { ChapterRequest } from "@/app/lib/data/dto/request_types";
import { BooDataResponse } from "@/app/lib/data/dto/response_types";
import styles from "@/app/ui/dashboard/chapter/chapter.module.css";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddChapterPage = () => {
    const [bookData, setBook] = useState<BooDataResponse>();
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [chapterTitle, setChapterTitle] = useState<string>("");
    const [chapterContent, setChapterContent] = useState<string>("");

    const id = params.id as string;
    const chapterCount = searchParams.get('chapterCount');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data: ChapterRequest = {
            chapterName: `Chương ${chapterCount ? parseInt(chapterCount) + 1 : 1}`,
            chapterTitle: chapterTitle,
            chapterContent: chapterContent
        }

        const response = await ChapterData.createChapter(data, id);
        if (response.result) {
            toast.success("Thêm Chapter thành công");
            router.push("/dashboard/book/" + id);
        } else {
            toast.error("Lỗi không thể thêm Chapter")
        }
    }

    const fetchBook = async () => {
        if (id) {
            const book = await BookData.getBook(id);
            if (book.code === 0 && book.result != null) {
                setChapterTitle(book.result.name+` - Chương ${chapterCount ? parseInt(chapterCount) + 1 : 1}`)
                setBook(book.result);
            }
        }
    };

    useEffect(() => {
        fetchBook();
    }, [id]);

    return (
        <>
            <div className={styles.container}>
                <div><h5>Truyện: {bookData?.name || "UnTitle"}</h5></div>
                <div className={styles.pdTop15}>
                    <h5>Chương {chapterCount ? parseInt(chapterCount) + 1 : 1}</h5>
                </div>
            </div>
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} type="text" placeholder="Nhập tiêu đề" />
                    <textarea
                        value={chapterContent}
                        onChange={(e) => setChapterContent(e.target.value)}
                        placeholder="Nhập nội dung chapter"
                        className={styles.formContentChapter}
                    ></textarea>
                    <button className={styles.button}>Xác nhận thêm</button>
                </form>
            </div>
        </>
    );
};

export default AddChapterPage;
