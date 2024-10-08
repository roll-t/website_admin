'use client'
import { fetchPostsByUser } from '@/app/lib/data'; // Import the function to fetch posts by user
import { PostDataModel } from '@/app/lib/models';
import Pagination from '@/app/ui/shared/paginationComponent/PaginationComponent'; // Adjust import path
import styles from '@/app/ui/users/userPosts.module.css'; // Adjust the path as necessary
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const POSTS_PER_PAGE = 10;

const UserPostsPage = ({ userId }: { userId: string }) => {
    const [postsData, setPostsData] = useState<PostDataModel[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { posts, total } = await fetchPostsByUser(userId, currentPage, POSTS_PER_PAGE);

                // Sort posts by createAt date in descending order
                const sortedPostsData = [...posts].sort((a, b) => {
                    const dateA = new Date(a.createAt).getTime();
                    const dateB = new Date(b.createAt).getTime();
                    return dateB - dateA; // Subtract timestamps
                });

                setPostsData(sortedPostsData);
                setTotalPosts(total);
            } catch (error) {
                console.error('Error fetching posts by user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [userId, currentPage]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <h1>Posts by User</h1>
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
                    {postsData.length === 0 ? (
                        <tr>
                            <td colSpan={5}>No posts found.</td>
                        </tr>
                    ) : (
                        postsData.map((post) => (
                            <tr key={post.id}>
                                <td className={styles.postImage}>
                                    <img src={post.imageList[0] || '/post.png'} alt="" width={50} height={50} />
                                </td>
                                <td>{post.title || "Untitled"}</td>
                                <td>{post.status || "Untitled"}</td>
                                <td>{format(new Date(post.createAt), 'dd/MM/yyyy HH:mm:ss') || 'no time'}</td>
                                <td>
                                    <div className={styles.btns}>
                                        <Link href={`/posts/${post.id}`}>
                                            <button className={`${styles.button} ${styles.view}`}>View</button>
                                        </Link>
                                        {/* Add additional actions if necessary */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPosts={totalPosts}
                postsPerPage={POSTS_PER_PAGE}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default UserPostsPage;
