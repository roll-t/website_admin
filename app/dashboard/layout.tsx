
import React from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from '../ui/dashboard/dashboard.module.css';
import Footer from '../ui/dashboard/footer/footer';
import Navbar from '../ui/dashboard/navbar/navbar';
import Sidebar from '../ui/dashboard/sidebar/sidebar';
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={styles.container}>
            <div className={styles.menu}>
                <Sidebar />
            </div>
            <div className={styles.content}>
                <Navbar />
                {children}
                <Footer />
            </div>
            <ToastContainer />
        </div>
    );
};

export default Layout;