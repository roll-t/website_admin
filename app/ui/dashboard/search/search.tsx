import React from 'react';
import styles from './search.module.css';
import { MdOutlineSearch } from "react-icons/md";
import { useDebouncedCallback } from 'use-debounce';

interface SearchProps {
    onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        onSearch(query);
    }, 300);

    return (
        <div className={styles.search}>
            <MdOutlineSearch size={20} />
            <input
                type="text"
                placeholder='Search...'
                className={styles.input}
                onChange={handleSearch}
            />
        </div>
    );
};

export default Search;
