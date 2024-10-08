import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QuerySnapshot, startAfter, updateDoc, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import firebaseConfig from './utils'; // Ensure this is correctly configured
import {PostDataModel, RestaurantModel, UserModel} from './models'; // Ensure this is correctly imported
import { User } from './interface/user';
import { deleteObject, ref } from 'firebase/storage';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

enum StatusPosts {
  active = 'active',
  waiting = 'waiting',
  error = 'error',
  private = 'private'
}

export async function fetchPosts(
  page: number,
  postsPerPage: number,
  searchQuery?: string,
  status?: StatusPosts, // Add status parameter
  userId?: string // Add userId parameter
): Promise<{ posts: PostDataModel[], total: number }> {
  const postsCollection = collection(firestore, 'posts');

  // Create the base query with ordering and limit
  let postsQuery = query(
    postsCollection,
    limit(postsPerPage)
  );

  // Apply userId filter if provided
  if (userId) {
    postsQuery = query(
      postsQuery,
      where('userId', '==', userId)
    );
  }

  // Apply search filter if provided
  if (searchQuery) {
    postsQuery = query(
      postsQuery,
      where('title', '>=', searchQuery),
      where('title', '<=', searchQuery + '\uf8ff')
    );
  }

  // Apply status filter if provided
  if (status) {
    postsQuery = query(
      postsQuery,
      where('status', '==', status)
    );
  }

  // Handle pagination
  if (page > 1) {
    const prevPageDocs = await getDocs(query(
      postsCollection,
      limit((page - 1) * postsPerPage)
    ));
    const lastDoc = prevPageDocs.docs[prevPageDocs.docs.length - 1];
    if (lastDoc) {
      postsQuery = query(
        postsQuery,
        startAfter(lastDoc),
        limit(postsPerPage)
      );
    }
  }

  try {
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
    const posts = snapshot.docs.map((doc) => PostDataModel.fromDocumentSnapshot(doc));

    // Get the total count of posts
    let total = 0;
    let totalQuery = query(postsCollection);

    // Apply userId filter to total count query if provided
    if (userId) {
      totalQuery = query(
        totalQuery,
        where('userId', '==', userId)
      );
    }

    // Apply search and status filters to total count query if provided
    if (searchQuery) {
      totalQuery = query(
        totalQuery,
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff')
      );
    }

    if (status) {
      totalQuery = query(
        totalQuery,
        where('status', '==', status)
      );
    }

    const totalSnapshot = await getDocs(totalQuery);
    total = totalSnapshot.size;

    return { posts, total };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

// Function to fetch a post by ID from Firestore
export async function fetchPostById(postId: string): Promise<PostDataModel | null> {
  const postDocRef = doc(firestore, 'posts', postId); // Reference to the specific document in the 'posts' collection

  try {
    const postDoc = await getDoc(postDocRef);
    if (postDoc.exists()) {
      return PostDataModel.fromDocumentSnapshot(postDoc); // Convert the document to PostDataModel
    } else {
      console.log('No such document!');
      return null; // Return null if the document does not exist
    }
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw new Error('Failed to fetch post by ID');
  }
}


export async function fetchAllUsers() {
  const usersCollection = collection(firestore, 'users'); // Reference to the 'users' collection

  try {
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => UserModel.fromDocumentSnapshot(doc)); // Convert each document to UserModel
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function fetchSingleUser(id: string): Promise<UserModel | null> {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', id));
    if (userDoc.exists()) {
      return UserModel.fromDocumentSnapshot(userDoc);
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}


export async function fetchPostsByUser(userId: string, page: number = 1, postsPerPage: number = 10): Promise<{ posts: PostDataModel[], total: number }> {
  const postsCollection = collection(firestore, 'posts');

  // Create the base query with userId, ordering, and limit
  let postsQuery = query(
      postsCollection,
      where('userId', '==', userId),
      limit(postsPerPage)
  );

  // Handle pagination
  if (page > 1) {
      const prevPageDocs = await getDocs(query(
          postsCollection,
          where('userId', '==', userId),
          limit((page - 1) * postsPerPage)
      ));
      const lastDoc = prevPageDocs.docs[prevPageDocs.docs.length - 1];
      if (lastDoc) {
          postsQuery = query(
              postsQuery,
              startAfter(lastDoc),
              limit(postsPerPage)
          );
      }
  }

  try {
      const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
      const posts = snapshot.docs.map(doc => PostDataModel.fromDocumentSnapshot(doc));

      // Get the total count of posts by user
      let total = 0;
      const totalQuery = query(
          postsCollection,
          where('userId', '==', userId)
      );

      const totalSnapshot = await getDocs(totalQuery);
      total = totalSnapshot.size;

      return { posts, total };
  } catch (error) {
      console.error('Error fetching posts by user:', error);
      throw new Error('Failed to fetch posts by user');
  }
}



export async function fetchTopUsersByPostCount(): Promise<User[]> {
  try {
    // Get a collection reference to 'posts'
    const postsCollection = collection(firestore, 'posts');
    
    // Aggregate user post counts
    const userPostCounts = new Map<string, number>();

    // Get all posts
    const postsSnapshot = await getDocs(postsCollection);
    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      const userId = post.userId; // Assuming each post has a 'userId' field
      
      // Increment post count for the user
      userPostCounts.set(userId, (userPostCounts.get(userId) || 0) + 1);
    });

    // Convert the map to an array of user post count objects
    const usersWithPostCounts = Array.from(userPostCounts.entries()).map(([userId, postCount]) => ({
      userId,
      totalPosts: postCount
    }));

    // Sort users by post count in descending order and take the top 4
    usersWithPostCounts.sort((a, b) => b.totalPosts - a.totalPosts);
    const topUsers = usersWithPostCounts.slice(0, 4);

    // Fetch user details for the top users
    const userCollection = collection(firestore, 'users');
    
    // Create a query to get the details of all top users in one go
    const userIds = topUsers.map(user => user.userId);
    const userQuery = query(userCollection, where('uid', 'in', userIds)); // Adjust field name as needed
    
    const userDetailsSnapshot = await getDocs(userQuery);
    const userDetailsMap = new Map<string, any>();

    // Map user details by userId
    userDetailsSnapshot.forEach(doc => {
      const userDoc = doc.data();
      userDetailsMap.set(userDoc.uid, {
        uid: userDoc.uid,
        displayName: userDoc.displayName || 'Unknown',
        avatarUrl: userDoc.avatarUrl,
        email: userDoc.email,
        phoneNumber: userDoc.phoneNumber,
        password: userDoc.password,
        status: userDoc.status || 'unknown',
        totalPosts: 0 // Will be updated later
      });
    });

    // Update totalPosts in user details
    const topUserDetails = topUsers.map(user => {
      const userDetail = userDetailsMap.get(user.userId);
      if (userDetail) {
        userDetail.totalPosts = user.totalPosts;
        return userDetail;
      }
      return {
        uid: user.userId,
        displayName: 'Unknown',
        avatarUrl: '',
        email: '',
        phoneNumber: '',
        password: '',
        status: 'unknown',
        totalPosts: user.totalPosts
      };
    });

    return topUserDetails;

  } catch (error) {
    console.error('Error fetching top users by post count:', error);
    return [];
  }
}

export async function fetchRestaurant() {
  const RestaurantsCollection = collection(firestore, 'restaurant'); // Reference to the 'restaurant' collection
  try {
    const snapshot = await getDocs(RestaurantsCollection);
    const restaurants = snapshot.docs.map((doc) => RestaurantModel.fromDocumentSnapshot(doc)); // Convert each document to RestaurantModel
    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error('Failed to fetch restaurants');
  }
}

// Function to fetch a restaurant by its ID from Firestore
export async function fetchRestaurantById(restaurantId: string): Promise<RestaurantModel | null> {
  const restaurantDocRef = doc(firestore, 'restaurant', restaurantId); // Reference to the specific document in the 'restaurant' collection

  try {
    const restaurantDoc = await getDoc(restaurantDocRef);
    if (restaurantDoc.exists()) {
      return RestaurantModel.fromDocumentSnapshot(restaurantDoc); // Convert the document to RestaurantModel
    } else {
      console.log('No such document!');
      return null; // Return null if the document does not exist
    }
  } catch (error) {
    console.error('Error fetching restaurant by ID:', error);
    throw new Error('Failed to fetch restaurant by ID');
  }
}

