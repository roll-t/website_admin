"use client"
import React from 'react';
import styles from './imageModal.module.css'; // Đảm bảo đường dẫn import đúng

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Full view" className={styles.modalImage} />
                <button className={styles.closeButton} onClick={onClose}>X</button>
            </div>
        </div>
    );
};

export default ImageModal;
