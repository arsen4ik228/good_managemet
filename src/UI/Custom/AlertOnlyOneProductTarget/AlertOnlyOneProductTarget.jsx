import React from 'react'
import classes from "./AlertOnlyOneProductTarget.module.css"

export default function AlertOnlyOneProductTarget({setModalOpen}) {
    return (
        <>
            <div className={classes.wrapper} onClick={() => setModalOpen(false)}>
                <div className={classes.modalContainer}>
                    <div
                        className={classes.modalContent}
                    >
                         Может существовать только одна задача с типом "Продукт" !!! 
                    </div>
                </div>
            </div>
        </>
    )
}
