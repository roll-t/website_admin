import React from 'react';
import styles from './pagination.module.css'; // Adjust the import path

interface PaginationProps {
    currentPage: number;
    totalPosts: number;
    postsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPosts, postsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className={styles.pagination}>
            <button
                className={`${styles.pageButton} ${currentPage !== 1 || styles.disabled}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    className={`${styles.pageButton} ${styles.itemPage} ${currentPage === index + 1 ? styles.active : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
            <button
                className={`${styles.pageButton} ${currentPage !== totalPages || styles.disabled}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
