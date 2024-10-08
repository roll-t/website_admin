import ImageApi from "@/app/lib/api/image_api";
import { ChangeEvent, useEffect, useState } from 'react';
import { MdAddAPhoto } from 'react-icons/md';
import { toast } from 'react-toastify';
import styles from "./uploadImage.module.css";

interface UploadFormProps {
    onUploadSuccess: (url: string) => void;
    currentImage?: string; // URL của ảnh hiện tại
}

export default function UploadForm({ onUploadSuccess, currentImage }: UploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(currentImage || null);

    useEffect(() => {
        // Cập nhật previewUrl và previousImageUrl khi currentImage thay đổi
        if (currentImage) {
            setPreviousImageUrl(currentImage);
            setPreviewUrl(currentImage);
        }
    }, [currentImage]);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const fileType = selectedFile.type;

            // Kiểm tra loại file
            if (fileType === 'image/png' || fileType === 'image/jpeg') {
                if (previousImageUrl) {
                    try {
                        await ImageApi.handleDelete(previousImageUrl);
                    } catch (error) {
                        toast.error("Lỗi khi xóa ảnh trước đó");
                    }
                }

                setFile(selectedFile);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result); // Cập nhật URL cho ảnh preview
                };
                reader.readAsDataURL(selectedFile);

                setUploading(true);

                try {
                    const response = await ImageApi.handleUpload(selectedFile);
                    if (response.code === 0 && response.result != null) {
                        onUploadSuccess(response.result.url as string); // Gọi hàm callback khi upload thành công
                        setPreviousImageUrl(response.result.url); // Lưu URL để xóa ảnh sau này
                    } else {
                        toast.error("Lỗi khi upload ảnh");
                    }
                } catch (error) {
                    toast.error("Có lỗi xảy ra trong quá trình upload");
                } finally {
                    setUploading(false);
                }
            } else {
                setFile(null);
                setPreviewUrl(null);
                toast.error("Ảnh thêm vào sai định dạng");
            }
        }
    };

    return (
        <div className={`${styles.uploadForm} ${!previewUrl && styles.centerCol}`}>
            {
                !previewUrl && !uploading && (
                    <label className={styles.inputFile}>
                        <MdAddAPhoto size={100} />
                        <input className={styles.hidden} type="file" onChange={handleFileChange} />
                    </label>
                )
            }
            {(previewUrl || currentImage) && <img src={previewUrl as string} alt="Selected file" className={styles.previewImage} />}
            {previewUrl && !uploading && (
                <button className={`${styles.btn} ${styles.rlt}`}>
                    Thay đổi
                    <input className={`${styles.hidden} ${styles.bsl}`} type="file" onChange={handleFileChange} />
                </button>
            )}
            {uploading && <p>Uploading...</p>}
        </div>
    );
}
