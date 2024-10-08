"use client"
import { usePathname } from 'next/navigation';
import styles from './navbar.module.css'
import {
     MdChat,
     MdNotifications,
     MdPublic
     } from "react-icons/md";

import React from 'react';
import Search from '../search/search';
const Navbar = () => {
    const pathname = usePathname();

    return (
        <div className={styles.container} >
            <div className={styles.title}>{pathname.split("/").pop()}</div>

                <div className={styles.menu}>
                    <Search onSearch={function (query: string): void {
                    throw new Error('Function not implemented.');
                } }/>
                    <div className={styles.icons}>
                    <MdChat size={20}/>
                    <MdNotifications size={20}/>
                    <MdPublic size={20}/>
                    </div>
                </div>

        </div>
    );
};
export default Navbar;