'use client'
import React from 'react';
import styles from './pagination.module.css'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Pagination = (props:any) => {
    const searchParams = useSearchParams()
    const {replace} =useRouter();
    const pathname= usePathname();
    const params= new URLSearchParams(searchParams);
    const page =searchParams.get('page') || 1

    const ITEM_PER_PAGE=2;

    const {count} = props || 10;

    const hasPrev=ITEM_PER_PAGE * (parseInt(String(page)) - 1) > 0 

    const hasNext =ITEM_PER_PAGE * (parseInt(String(page)) - 1) + ITEM_PER_PAGE < count
    
    const handleClick = (btn:string)=>{
        const newPage = btn == "prev" ? parseInt(String(page)) - 1 : parseInt(String(page)) + 1;
        params.set("page", newPage.toString());
        replace(`${pathname}?${params}`)
    }
    return (
        <div className={styles.container}>
            <div className={styles.paging}>
                <button className={styles.prev} disabled={!hasPrev} onClick={()=>handleClick("prev")}>
                    Previous
                </button>
                <button className={styles.next} disabled={!hasNext} onClick={()=>handleClick("next")} >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;