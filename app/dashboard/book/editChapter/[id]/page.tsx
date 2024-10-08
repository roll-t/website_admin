"use client";
import ChapterData from "@/app/lib/data/chapter_data";
import { ChapterRequest } from "@/app/lib/data/dto/request_types";
import { ChapterResponse } from "@/app/lib/data/dto/response_types";
import styles from "@/app/ui/dashboard/chapter/chapter.module.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditChapter = ({ params }: any) => {
    const { id } = params;


    const [chapter,setChapter] = useState<ChapterResponse>();
    const [chapterTitle, setChapterTitle] = useState<string>("");
    const [chapterContent, setChapterContent] = useState<string>("");
    const [chapterTitlePre, setChapterTitlePre] = useState<string>("");
    const [chapterContentPre, setChapterContentPre] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (chapterTitle !== chapterTitlePre || chapterContent !== chapterContentPre) {
            const data: ChapterRequest = {
                chapterTitle,
                chapterContent,
                chapterName:chapter?.chapterName || ""
            };
            
            const response = await ChapterData.updateChapter(id, data);

            if (response.code === 0 && response.result) {
                toast.success("sửa chapter thành công");
            }else{
                toast.error("lỗi không thể sửa chapter")
            }
        }else{
            toast.warning("Không có j thay đổi")
        }
    };

    const fetchChapter = async () => {
        if (id) {
            const chapter = await ChapterData.getChapterById(id);
            if (chapter.code === 0) {
                setChapter(chapter.result);
                setChapterTitle(chapter.result.chapterTitle);
                setChapterContent(chapter.result.chapterContent);
                setChapterTitlePre(chapter.result.chapterTitle);
                setChapterContentPre(chapter.result.chapterContent);
            }
        }
    };

    useEffect(() => {
        fetchChapter();
    }, [id]);

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    type="text"
                    placeholder="Nhập tiêu đề"
                />
                <textarea
                    value={chapterContent}
                    onChange={(e) => setChapterContent(e.target.value)}
                    placeholder="Nhập nội dung chapter"
                    className={styles.formContentChapter}
                ></textarea>
                <button className={styles.button}>Xác nhận sửa</button>
            </form>
        </div>
    );
};

export default EditChapter;
