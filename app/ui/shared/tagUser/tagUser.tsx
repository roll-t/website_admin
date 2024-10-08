"use client"
import React, { useEffect, useState } from 'react';
import { fetchSingleUser } from '@/app/lib/data';
import styles from './tagUser.module.css';
import { UserModel } from '@/app/lib/models'; // Đảm bảo UserModel được import đúng cách

interface TagUserProps {
  uid: string;
}

const TagUser: React.FC<TagUserProps> = ({ uid }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchSingleUser(uid);
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`${styles.container} ${styles.formContainer}`}>
      <div className={styles.avatar}>
        <img className={styles.avatarImage} src={user?.avatarUrl || '/user.png'} alt="User Avatar" />
      </div>
      <ul className={styles.list}>
        <li>Name: {user?.displayName || 'User Name'}</li>
        <li>Email: {user?.email || 'User Email'}</li>
      </ul>
    </div>
  );
};

export default TagUser;
