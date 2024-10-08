"use client"
import styles from './sidebar.module.css';

import Authentication from '@/app/lib/data/authentication';
import { useRouter } from 'next/navigation';
import {
    MdAccountCircle,
    MdBook,
    MdCategory,
    MdDashboard,
    MdLogout,
    MdPostAdd,
    MdRestaurant
} from "react-icons/md";
import MenuLink from './menuLink/menuLink';

const menuItems = [
    {
        title: "pages",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: <MdDashboard />,
            },
            {
                title: "User",
                path: "/dashboard/users",
                icon: <MdAccountCircle />,
            },
            {
                title: "Posts",
                path: "/dashboard/posts",
                icon: <MdPostAdd />,
            },
            {
                title: "Restaurant",
                path: "/dashboard/restaurant",
                icon: <MdRestaurant />,
            },
            {
                title: "Danh mục",
                path: "/dashboard/category",
                icon: <MdCategory />,
            },
            {
                title: "Sách",
                path: "/dashboard/book",
                icon: <MdBook />,
            }
        ]
    },
]



const Sidebar = () => {
    const router = useRouter();
    const logout = () => {
        if (Authentication.logout()) {
            router.push("/")
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <img className={styles.userImg} src="/user.png" alt="" width='50' height='50' />
                <div className={styles.userDetail}>
                    <span className={styles.userName}>Phuoc truong</span>
                    <span className={styles.userTitle}>admin</span>
                </div>
            </div>
            <ul className={styles.list}>
                {
                    menuItems.map(cat => (
                        <li key={cat.title}>
                            <span className={styles.cat}>{cat.title}</span>
                            {cat.list.map(item => (
                                <MenuLink item={item} key={item.title} />
                            ))}
                        </li>
                    ))
                }
            </ul>

            <button onClick={logout} className={styles.logout}>
                <MdLogout />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;