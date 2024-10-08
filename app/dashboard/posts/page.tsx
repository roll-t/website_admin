"use client";

import { deletePostById } from '@/app/lib/actions';
import { fetchPosts } from '@/app/lib/data';
import { PostDataModel } from '@/app/lib/models';
import Search from '@/app/ui/dashboard/search/search';
import styles from '@/app/ui/products/products.module.css';
import Pagination from '@/app/ui/shared/paginationComponent/PaginationComponent'; // Adjust import path
import { format } from 'date-fns';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

// Define the status options
enum StatusPosts {
    active = 'active',
    waiting = 'waiting',
    error = 'error',
    private = 'private'
}

const POSTS_PER_PAGE = 10;

interface ProductPageProps {
    userId?: string; // Make userId optional
}

const ProductPage: React.FC<ProductPageProps> = ({ userId }) => {
    const [postsData, setPostsData] = useState<PostDataModel[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<StatusPosts | undefined>(undefined);

    useEffect(() => {
        const loadPosts = async () => {
            console.log('Fetching posts with query:', searchQuery, 'and status:', statusFilter);
            try {
                const { posts, total } = await fetchPosts(currentPage, POSTS_PER_PAGE,
                    searchQuery,
                    statusFilter,
                    userId // Pass the userId to the fetch function
                );

                // Sort posts by createAt date in descending order
                const sortedPostsData = [...posts].sort((a, b) => {
                    const dateA = new Date(a.createAt).getTime();
                    const dateB = new Date(b.createAt).getTime();
                    return dateB - dateA; // Subtract timestamps
                });

                setPostsData(sortedPostsData);
                setTotalPosts(total);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        loadPosts();
    }, [currentPage, searchQuery, statusFilter, userId]);

    // Handle the deletion of a post
    const handleDelete = async (postId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
        if (!confirmDelete) return;
        try {
            await deletePostById(postId);
            toast.success("Post and associated images deleted successfully");
            // Reload posts after deletion
            const { posts, total } = await fetchPosts(currentPage,
                POSTS_PER_PAGE,
                searchQuery,
                statusFilter,
                userId // Pass the userId to the fetch function
            );

            // Sort posts by createAt date in descending order
            const sortedPostsData = [...posts].sort((a, b) => {
                const dateA = new Date(a.createAt).getTime();
                const dateB = new Date(b.createAt).getTime();
                return dateB - dateA; // Subtract timestamps
            });

            setPostsData(sortedPostsData);
            setTotalPosts(total);
        } catch (error) {
            toast.error("Failed to delete post");
            console.error('Failed to delete post:', error);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to the first page
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value as StatusPosts);
        setCurrentPage(1); // Reset to the first page
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.head}>
                    <Search onSearch={handleSearch} />
                    <button className={styles.btnAdd}>
                        <select onChange={handleStatusChange} value={statusFilter || ''}>
                            <option value="">All</option>
                            <option value={StatusPosts.active}>Active</option>
                            <option value={StatusPosts.waiting}>Waiting</option>
                            <option value={StatusPosts.error}>Error</option>
                            <option value={StatusPosts.private}>Private</option>
                        </select>
                    </button>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <td>Image</td>
                            <td>Title</td>
                            <td>Status</td>
                            <td>Create at</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {postsData.map((post) => (
                            <tr key={post.id}>
                                <td className={styles.product}>
                                    <img src={post.imageList[0] || '/product.png'} alt="" width={50} height={50} />
                                </td>
                                <td>{post.title || "Untitled"}</td>
                                <td><span className={`${styles.type} ${post?.status}`} >{post.status || "Untitled"}</span></td>
                                <td>{format(new Date(post.createAt), 'dd/MM/yyyy HH:mm:ss') || 'no time'}</td>
                                <td>
                                    <div className={styles.btns}>
                                        <Link href={`/dashboard/posts/${post.id}`}>
                                            <button className={`${styles.button} ${styles.view}`}>View</button>
                                        </Link>
                                        <button
                                            className={`${styles.button} ${styles.delete}`}
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ToastContainer />
                <Pagination
                    currentPage={currentPage}
                    totalPosts={totalPosts}
                    postsPerPage={POSTS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ProductPage;
