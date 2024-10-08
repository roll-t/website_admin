// UserModel.ts
export interface User {
    uid: string;
    displayName: string;
    avatarUrl?: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    status?: string;
    totalPosts: number;
    lastPostDate?: string;
  }
  