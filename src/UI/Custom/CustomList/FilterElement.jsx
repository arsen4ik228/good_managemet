import React from 'react'
import classes from './FilterElement.module.css'

export default function FilterElement({ array, state, setState, setOpenFilter }) {
    return (
        <div className={classes.block}>
            {
                array?.map((item) => (
                    <button
                        className={`${classes.item} ${item.value === state ? classes.active : classes.notActive}`}
                        onClick={() => {
                            setState(item.value);
                            setTimeout(() => setOpenFilter(false), 500);
                        }}
                    >
                        {item?.label}
                    </button>
                ))
            }
        </div>
    )
}
