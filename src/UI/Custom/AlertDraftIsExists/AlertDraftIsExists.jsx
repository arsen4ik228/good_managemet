import React from 'react'
import classes from "./AlertDraftIsExists.module.css"

export default function AlertDraftIsExists({setModalOpen}) {
    return (
        <>
            <div className={classes.wrapper} onClick={() => setModalOpen(false)}>
                <div className={classes.modalContainer}>
                    <div
                        className={classes.modalContent}
                    >
                        У вас уже есть "Черновик" Cтратегии. <br/>
                         "Черновик" Cтратегии может существовать только один. 
                    </div>
                </div>
            </div>
        </>
    )
}
