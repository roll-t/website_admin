"use client";
import React, { useEffect, useState } from 'react';
import { fetchRestaurantById } from '@/app/lib/data';
import { updateRestaurantStatus, deleteRestaurant } from '@/app/lib/actions';
import TagUser from '@/app/ui/shared/tagUser/tagUser';
import ImageModal from '@/app/ui/shared/ImageModal/ImageModal'; // Đảm bảo đúng đường dẫn
import styles from '@/app/ui/products/singleProduct/singleProduct.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation'; // Sử dụng useRouter từ next/navigation


const SingleRestaurantPage = ({ params }: any) => {
    const { id } = params;
    const [restaurant, setRestaurant] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const router = useRouter(); // Initialize router

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRestaurantById(id);
                setRestaurant(data);
            } catch (error) {
                console.error('Error fetching restaurant:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleExamine = async () => {
        if (restaurant) {
            try {
                if (restaurant.status != "active") {
                    await updateRestaurantStatus(id, 'active'); // Cập nhật trạng thái thành 'active'
                    setRestaurant((prev: any) => ({ ...prev, status: 'active' }));
                    toast.success('Restaurant status updated to active');
                } else {
                    toast.warning('Restaurant activating status');
                }
            } catch (error) {
                console.error('Error updating status:', error);
                toast.error('Failed to update restaurant status');
            }
        }
    };

    const handleError = async () => {
        if (restaurant) {
            try {
                if (restaurant.status != "error") {
                    await updateRestaurantStatus(id, 'error'); // Cập nhật trạng thái thành 'error'
                    setRestaurant((prev: any) => ({ ...prev, status: 'error' }));
                    toast.success('Restaurant status updated to error');
                } else {
                    toast.warning('The restaurant is in an error state');
                }
            } catch (error) {
                console.error('Error updating status:', error);
                toast.error('Failed to update restaurant status');
            }
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this restaurant?")) {
            return;
        }

        if (restaurant) {
            try {
                const imageUrls = [
                    ...(restaurant?.licenseRestaurant || []),
                    ...(restaurant?.onwnerLicenseImages || [])
                ];
                await deleteRestaurant(id, imageUrls); // Delete the restaurant and related images
                toast.success('Restaurant deleted successfully');
                router.push("/dashboard/restaurant"); // Navigate to the restaurant list page
            } catch (error) {
                console.error('Error deleting restaurant:', error);
                toast.error('Failed to delete restaurant');
            }
        }
    };

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <ToastContainer />
            <TagUser uid={restaurant?.userId} />
            <div className={styles.container}>
                <div className={styles.column}>
                    <div className={styles.infoContainer}>
                        <label htmlFor="">Restaurant License</label>
                        <div className={styles.listImage}>
                            {restaurant?.licenseRestaurant.map((image: string, index: number) => (
                                <div className={styles.itemsImage} key={index} onClick={() => handleImageClick(image)}>
                                    <img className={styles.imageStyle} src={image || '/product.png'} alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoContainer}>
                        <label htmlFor="">Owner License</label>
                        <div className={styles.listImage}>
                            {restaurant?.onwnerLicenseImages.map((image: string, index: number) => (
                                <div className={styles.itemsImage} key={index} onClick={() => handleImageClick(image)}>
                                    <img className={styles.imageStyle} src={image || '/product.png'} alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <form action="" className={styles.form}>
                        <label htmlFor="title">Status</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={restaurant?.status}
                            placeholder='Status'
                            name='title'
                            required
                            readOnly
                        />
                        <label htmlFor="title">Restaurant name</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={restaurant?.nameRestaurant}
                            placeholder='Title'
                            name='title'
                            required
                            readOnly
                        />

                        <label htmlFor="description">Adderss</label>
                        <textarea
                            value={restaurant?.addressRestaurant}
                            className={styles.input}
                            name="description"
                            id="description"
                            placeholder='Description'
                            readOnly
                        ></textarea>
                        <label htmlFor="description">Address</label>
                    </form>
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

            {selectedImage && (
                <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default SingleRestaurantPage;
