import React from 'react'
import classes from './CustomList.module.css'
import dropdown from '@image/drop-down.svg';
import search from '@image/search.svg'
import ListAddButtom from '../ListAddButton/ListAddButtom';
import LisElem from './ListElem';

export default function CustomList({ title, addButtonText, children }) {
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.title}>
                    <div>{title}</div>
                    <div>
                        <img src={search} alt="search" />
                        <img src={dropdown} alt="dropdown" />
                    </div>
                </div>

                {addButtonText && (
                    <ListAddButtom 
                        textButton={addButtonText}
                    />
                )}

                {children}

            </div>
        </>
    )
}
