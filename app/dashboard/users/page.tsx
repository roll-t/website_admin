"use client";
import { fetchAllUsers } from '@/app/lib/data'; // Import your function to fetch users
import { UserModel } from '@/app/lib/models'; // Import your UserModel
import Search from '@/app/ui/dashboard/search/search';
import Pagination from '@/app/ui/shared/pagination/pagination';
import styles from '@/app/ui/users/users.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const UserPage = ({ searchParams }: any) => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const getUsers = async () => {
            setLoading(true);
            try {
                const usersList = await fetchAllUsers();
                setUsers(usersList);
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, [searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <Search onSearch={handleSearch} />
                <button className={styles.btnAdd}>
                    <Link href={'/dashboard/users/add'}>
                        Add New
                    </Link>
                </button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Avatar</td>
                        <td>Email</td>
                        <td>Created at</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.uid}>
                            <td className={styles.userName}>
                                <div className={styles.avatvar}>
                                    <img className={styles.avatarImage} src={ user.avatarUrl||'/user.png'} alt="" />
                                </div>
                                {user.displayName || "user name"}
                            </td>
                            {/* <td>{user}</td> */}
                            <td>{user.email}</td>
                            <td>{user.createdAt || 'no time'}</td>
                            <td>
                                <div className={styles.btns}>
                                    <Link href={`/dashboard/users/${user.uid}`}>
                                        <button className={`${styles.button} ${styles.view}`}>
                                            View
                                        </button>
                                    </Link>
                                    <form>
                                        <input type="hidden" value={user.uid} name="_id" />
                                        <button className={`${styles.button} ${styles.delete}`}>Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination count={3} />
        </div>
    );
};

export default UserPage;
