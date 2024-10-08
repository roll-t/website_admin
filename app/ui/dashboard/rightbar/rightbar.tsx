
import React from 'react';
import styles from './rightbar.module.css'
import { MdOutlinePlayCircleFilled,MdOutlineReadMore } from "react-icons/md";
const Rightbar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <img  className={styles.bgContainer} src="/astronaut.png" alt="" />
                <div className={styles.texts}>
                    <span className={styles.notification}>
                        🔥 Avilable Now
                    </span>
                    <h3 className={styles.title}> How to use the new version of the admin dashboard?</h3>
                    <span className={styles.note}>Boost your producitvity</span>
                    <p className={styles.description}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio minima illo quidem culpa 
                        alias unde aperiam! Ullam doloremque nulla!</p>
                <button className={styles.button}>
                <MdOutlinePlayCircleFilled size={20} />
                Watch
                </button>
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.texts}>
                    <span className={styles.notification}>
                        🔥 Avilable Now
                    </span>
                    <h3 className={styles.title}> How to use the new version of the admin dashboard?</h3>
                    <span className={styles.note}>Boost your producitvity</span>
                    <p className={styles.description}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio minima illo quidem culpa 
                        alias unde aperiam! Ullam doloremque nulla!</p>
                <button className={styles.button}>
                <MdOutlineReadMore size={20}/>
                Learn
                </button>
                </div>
            </div>
        </div>
    );
};

export default Rightbar;