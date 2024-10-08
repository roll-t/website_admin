"use client"
import React, { useEffect, useState } from 'react';
import styles from './transactions.module.css';
import { fetchTopUsersByPostCount } from '@/app/lib/data'; // Adjust the import path
import { UserModel } from '@/app/lib/models'; // Adjust the import path
import { User } from '@/app/lib/interface/user';

const Transactions = () => {
    const [topUsers, setTopUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadTopUsers = async () => {
            const users = await fetchTopUsersByPostCount();
            setTopUsers(users);
        };

        loadTopUsers();
    }, []);

    const currentDate = new Date();

    // Format the date (e.g., "June 29, 2024")
    const formattedDate = currentDate.toLocaleDateString();
  

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Top 4 Users with Most Posts</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Date</td>
                        <td>Amount Posts</td>
                    </tr>
                </thead>
                <tbody>
                    {topUsers.map((user) => (
                        <tr key={user.uid}>
                            <td>
                                <div className={styles.user}>
                                    <img
                                        src={user.avatarUrl || '/user.png'} // Use user's avatar if available
                                        width={40}
                                        height={40}
                                        className={styles.userImg}
                                        alt={user.displayName}
                                    />
                                    {user.displayName}
                                </div>
                            </td>
                            <td>
                                <span>
                                    {user?.email || 'unknown'}
                                </span>
                            </td>
                            <td>
                                {/* Display placeholder date as no date information is available */}
                                {formattedDate}
                            </td>
                            <td>
                                <span className={`${styles.done} ${styles.status}`}>
                                    {user?.totalPosts || 'unknown'}
                                </span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
