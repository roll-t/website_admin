import { collection, deleteDoc, doc, getDoc, getDocs, QuerySnapshot, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './utils'; // Assuming firebaseConfig is correctly imported
import { PostDataModel } from './models'; // Import your PostDataModel
import { deleteObject, getStorage, ref } from 'firebase/storage';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);


// Initialize Firebase Storage
const storage = getStorage(app);


// Function to update the status of a post in Firestore
export async function updatePostStatus(postId: string, newStatus: string): Promise<void> {
    const postDocRef = doc(firestore, 'posts', postId); // Reference to the specific document in the 'posts' collection

    try {
        await updateDoc(postDocRef, { status: newStatus });
        console.log('Post status updated successfully');
    } catch (error) {
        console.error('Error updating post status:', error);
        throw new Error('Failed to update post status');
    }
}

// Function to delete a post by ID from Firestore and associated images from Storage
export async function deletePostById(postId: string): Promise<void> {
    const postDocRef = doc(firestore, 'posts', postId); // Reference to the specific document in the 'posts' collection

    try {
        // Fetch the post to get the image URLs
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
            const postData = postDoc.data() as PostDataModel;

            // Delete each image from Storage
            if (postData.imageList) {
                for (const imageUrl of postData.imageList) {
                    const imageRef = ref(storage, imageUrl);
                    try {
                        await deleteObject(imageRef);
                        console.log(`Image ${imageUrl} deleted successfully`);
                    } catch (imageError) {
                        console.error(`Error deleting image ${imageUrl}:`, imageError);
                    }
                }
            }

            // Delete the post document from Firestore
            await deleteDoc(postDocRef);
            console.log('Post deleted successfully');
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }
}

export const updateRestaurantStatus = async (id: string, status: string) => {
    const restaurantRef = doc(firestore, 'restaurant', id);
    await updateDoc(restaurantRef, { status });
};

// Xóa nhà hàng và các hình ảnh liên quan
export const deleteRestaurant = async (id: string, imageUrls: string[]): Promise<void> => {
    const restaurantRef = doc(firestore, 'restaurant', id);

    try {
        // Xóa hình ảnh từ Firebase Storage
        const deleteImagePromises = imageUrls.map(url => {
            const imageRef = ref(storage, url);
            return deleteObject(imageRef);
        });
        await Promise.all(deleteImagePromises);
        console.log('All images deleted successfully');

        // Xóa tài liệu nhà hàng từ Firestore
        await deleteDoc(restaurantRef);
        console.log('Restaurant deleted successfully');
    } catch (error) {
        console.error('Error deleting restaurant and/or images:', error);
        throw new Error('Failed to delete restaurant and/or images');
    }
};