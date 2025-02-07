import React from 'react'
import classes from "./SetPolicyDirectoryName.module.css"

export default function SetPolicyDirectoryName({ setModalOpen, requestFunction, setName, name }) {
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.modalContainer}>
                    <div
                        className={classes.modalContent}
                    >
                        <input type="text" value={name ? name : ''} placeholder='Введите название' onChange={(e) => setName(e.target.value)}/>
                        <div className={classes.inputColumn}>
                            <div className={classes.inputRow2}>
                                <button onClick={() => requestFunction()}> СОЗДАТЬ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
