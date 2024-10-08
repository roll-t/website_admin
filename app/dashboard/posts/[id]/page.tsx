"use client";
import { deletePostById, updatePostStatus } from '@/app/lib/actions';
import { fetchPostById } from '@/app/lib/data';
import { PostDataModel } from '@/app/lib/models'; // Đảm bảo bạn import đúng model
import styles from '@/app/ui/products/singleProduct/singleProduct.module.css';
import TagUser from '@/app/ui/shared/tagUser/tagUser';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation'; // Sử dụng useRouter từ next/navigation
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MapComponent = dynamic(() => import('@/app/ui/shared/maps/MapComponent'), { ssr: false });

const SingleProductPage = () => {
    const pathname = usePathname();
    const router = useRouter(); // Khai báo useRouter
    const idPosts = pathname.split("/").pop() || "";
    const [singlePosts, setSinglePosts] = useState<PostDataModel | null>(null); // Đặt kiểu dữ liệu cho state

    useEffect(() => {
        const getPostData = async () => {
            try {
                const postData = await fetchPostById(idPosts);
                setSinglePosts(postData);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        getPostData();
    }, [idPosts]);

    // Hàm xử lý sự kiện Examine
    const handleExamine = async () => {
        try {
            if (singlePosts?.status == "private") {
                toast.warning("The post is set to private. Status changes are not allowed for private posts.");
                return;
            }
            if (singlePosts?.status !== "active") {
                await updatePostStatus(singlePosts?.id, 'active'); // Thay 'newStatus' bằng trạng thái mới bạn muốn cập nhật
                toast.success("Post has been activated");
                setSinglePosts({ ...singlePosts, status: 'active' } as PostDataModel); // Cập nhật trạng thái bài viết
            } else {
                toast.warning("Post is already active");
            }
        } catch (error) {
            toast.error('Failed to update post status');
        }
    };

    // Hàm xử lý sự kiện Error
    const handleError = async () => {
        if (singlePosts?.status == "private") {
            toast.warning("The post is set to private. Status changes are not allowed for private posts.");
            return;
        }
        try {
            if (singlePosts?.status !== "error") {
                await updatePostStatus(singlePosts?.id, 'error'); // Thay 'newStatus' bằng trạng thái mới bạn muốn cập nhật
                toast.success("Post has been changed to error status");
                setSinglePosts({ ...singlePosts, status: 'error' } as PostDataModel); // Cập nhật trạng thái bài viết
            } else {
                toast.warning("Post is already error");
            }
        } catch (error) {
            console.error('Failed to update post status:', error);
            toast.error('Failed to update post status');
        }
    };

    // Hàm xử lý xóa bài viết
    const handleDelete = async () => {
        // Hiển thị hộp thoại xác nhận
        const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
        if (!confirmDelete) return; // Nếu người dùng không xác nhận, không làm gì cả
        try {
            await deletePostById(singlePosts?.id);
            toast.success("Post and associated images deleted successfully");
            // Điều hướng đến trang danh sách sản phẩm
            router.push('/dashboard/products'); // Chuyển hướng đến /dashboard/products
        } catch (error) {
            toast.error("Failed to delete post");
            console.error('Failed to delete post:', error);
        }
    };

    if (!singlePosts) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ToastContainer />
            <TagUser uid={singlePosts.userId} />
            <div className={styles.container}>
                <div className={styles.infoContainer}>
                    <div className={styles.listImage}>
                        {singlePosts?.imageList.map((images: any, index: any) => (
                            <div className={styles.itemsImage} key={index}>
                                <img className={styles.imageStyle} src={images || '/product.png'} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.formContainer}>
                    <form action="" className={styles.form}>
                        <label htmlFor="title">Status</label>
                        <input className={styles.input} type="text" value={singlePosts?.status} placeholder='Status' name='title' required readOnly />
                        <label htmlFor="title">Title</label>
                        <input className={styles.input} type="text" value={singlePosts?.title} placeholder='Title' name='title' required readOnly />

                        <label htmlFor="description">Description</label>
                        <textarea
                            value={singlePosts?.subtitle}
                            className={styles.input}
                            name="description"
                            id="description"
                            placeholder='Description'
                            readOnly
                        ></textarea>
                        <label htmlFor="description">Address</label>
                        <textarea
                            value={singlePosts?.placeMap.display_name === 'Accessing your current location' ?
                                'Posts with direct location access' :
                                singlePosts?.placeMap.display_name}
                            className={styles.input}
                            name="Address"
                            id="Address"
                            placeholder='Address'
                            readOnly
                        ></textarea>
                    </form>

                    <div className={styles.mapContainer}>
                        <MapComponent lat={singlePosts?.placeMap.lat} lon={singlePosts?.placeMap.lon} />
                    </div>

                    <div className={styles.listButton}>
                        <button
                            className={`${styles.buttonItems} ${styles.examine}`}
                            onClick={handleExamine}
                        >
                            Examine
                        </button>
                        <button
                            className={`${styles.buttonItems} ${styles.error}`}
                            onClick={handleError}
                        >
                            Error
                        </button>
                        <button
                            className={`${styles.buttonItems} ${styles.delete}`}
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProductPage;
