import React, { useEffect, useState, useRef } from 'react'
import classes from './CustomList.module.css'
import dropdown from '@image/drop-down.svg';
import search from '@image/search.svg'
import icon_filter from '@image/icon_filter.svg'
import ListAddButtom from '../ListAddButton/ListAddButtom';
import ListElem from './ListElem';

export default function CustomList({
    title,
    isFilter,
    setOpenFilter,
    addButtonText,
    addButtonClick,
    searchValue,
    searchFunc,
    onExpandedChange, // опциональный callback для управления извне
    selectedItem,
    expanded, // опциональное внешнее управление состоянием
    children
}) {
    // Внутреннее состояние используется только если expanded не передано извне
    const [internalExpanded, setInternalExpanded] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const listRef = useRef(null);

    // Определяем, используем ли внешнее управление
    const isControlled = expanded !== undefined;

    // Текущее состояние expanded (внешнее или внутреннее)
    const currentExpanded = isControlled ? expanded : internalExpanded;

    // Синхронизируем внутреннее состояние при изменении внешнего
    useEffect(() => {
        if (!isControlled) {
            setInternalExpanded(true); // значение по умолчанию для внутреннего управления
        }
    }, [isControlled]);

    const toggleDropdown = () => {
        const newExpandedState = !currentExpanded;

        if (isControlled) {
            // Если компонент управляется извне - вызываем callback
            onExpandedChange?.(newExpandedState);
        } else {
            // Если внутреннее управление - обновляем внутреннее состояние
            setInternalExpanded(newExpandedState);
        }
    };

    // Если expanded изменился извне - синхронизируем внутреннее состояние
    useEffect(() => {
        if (isControlled) {
            setInternalExpanded(expanded);
        }
    }, [expanded, isControlled]);

    const toggleFilter = () => {
        setOpenFilter?.((prev) => !prev);
    }

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showSearch) {
            searchFunc?.('');
        }
    };

    const handleSearchChange = (e) => {
        searchFunc?.(e.target.value);
    };


    const searchInputRef = useRef(null);

    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div>{title}</div>
                <div className={classes.controls}>
                    <div className={`${classes.searchContainer} ${showSearch ? classes.searchActive : ''}`}>
                        <form className={classes.searchForm}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Поиск..."
                                value={searchValue || ''}
                                onChange={handleSearchChange}
                                className={classes.searchInput}
                            />
                        </form>
                    </div>

                    {isFilter && (
                        <img
                            src={icon_filter}
                            alt="filter"
                            className={classes.searchIcon}
                            onClick={toggleFilter}
                        />
                    )}
                    {searchFunc && (

                    <img
                        src={search}
                        alt="search"
                        className={classes.searchIcon}
                        onClick={toggleSearch}
                    />
                    )}
                    <img
                        src={dropdown}
                        alt="dropdown"
                        className={`${classes.dropdownIcon} ${!currentExpanded ? classes.rotated : ''}`}
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
                <div className={`${classes.singleItemContainer} ${currentExpanded ? classes.collapsed : ''}`}>
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
                className={`${classes.listContainer} ${!currentExpanded ? classes.collapsed : ''}`}
            >
                {children}
            </div>
        </div>
    )
}