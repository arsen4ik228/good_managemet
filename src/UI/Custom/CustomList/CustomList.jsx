import React, { useState } from 'react'
import classes from './CustomList.module.css'
import dropdown from '@image/drop-down.svg';
import search from '@image/search.svg'
import ListAddButtom from '../ListAddButton/ListAddButtom';

export default function CustomList({ title, addButtonText, addButtonClick, searchValue, searchFunc, children }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showSearch, setShowSearch] = useState(false);

    const toggleDropdown = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showSearch) {
            searchFunc(''); 
        }
    };

    const handleSearchChange = (e) => {
        searchFunc(e.target.value);
    };


    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div>{title}</div>
                <div className={classes.controls}>
                    <div className={`${classes.searchContainer} ${showSearch ? classes.searchActive : ''}`}>
                        <form className={classes.searchForm}>
                            <input
                                type="text"
                                placeholder="Поиск..."
                                value={searchValue}
                                onChange={handleSearchChange}
                                className={classes.searchInput}
                            />
                        </form>
                    </div>
                    <img 
                        src={search} 
                        alt="search" 
                        className={classes.searchIcon}
                        onClick={toggleSearch}
                    />
                    <img 
                        src={dropdown} 
                        alt="dropdown" 
                        className={`${classes.dropdownIcon} ${!isExpanded ? classes.rotated : ''}`}
                        onClick={toggleDropdown}
                    />
                </div>
            </div>

            {addButtonText && (
                <ListAddButtom 
                    textButton={addButtonText}
                    clickFunc={addButtonClick}
                />
            )}

            <div className={`${classes.contentContainer} ${isExpanded ? classes.expanded : classes.collapsed}`}>
                {children}
            </div>
        </div>
    )
}