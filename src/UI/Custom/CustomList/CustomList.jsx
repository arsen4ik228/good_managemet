import React, { useEffect, useState, useRef } from 'react'
import classes from './CustomList.module.css'
import dropdown from '@image/drop-down.svg';
import search from '@image/search.svg'
import icon_filter from '@image/icon_filter.svg'
import ListAddButtom from '../ListAddButton/ListAddButtom';
import ListElem from './ListElem';

export default function CustomList({ title, isFilter, setOpenFilter, addButtonText, addButtonClick, searchValue, searchFunc, selectedItem, expanded = true, children }) {
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [showSearch, setShowSearch] = useState(false);
    const listRef = useRef(null);

    const toggleDropdown = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleFilter = () => {
        setOpenFilter((prev) => !prev);
    }

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

                    {
                        isFilter &&
                        <img
                            src={icon_filter}
                            alt="filter"
                            className={classes.searchIcon}
                            onClick={toggleFilter}
                        />
                    }

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

            {selectedItem && (
                <div className={`${classes.singleItemContainer} ${isExpanded ? classes.collapsed : ''}`}>
                    <ListElem
                        icon={selectedItem?.icon}
                        upperText={selectedItem?.upperText}
                        bottomText={selectedItem?.bottomText}
                        bage={selectedItem?.bage}
                        linkSegment={selectedItem?.linkSegment}
                        clickFunc={selectedItem?.clickFunc}
                    />
                </div>
            )}

            {/* Контейнер для списка с фиксированной высотой и скроллом */}
            <div
                ref={listRef}
                className={`${classes.listContainer} ${!isExpanded ? classes.collapsed : ''}`}
            >
                {children}
            </div>
        </div>
    )
}