import React, { useState } from 'react'
import classes from './AddeWatcherContainer.module.css'
import addedWatcher from '@image/icon _ addWatcher.svg'
import AllPostModal from './AllPostModal'


export default function AddedWatcherContainer() {
    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.content}>
                    <div className={classes.text}>Копия:</div>
                    <div className={classes.imgContainer}>
                        <div className={classes.userAvatarContainer}>
                            <img src="" alt="" />
                        </div>
                        <div className={classes.addedButton}>
                            <img src={addedWatcher} alt="addedButton" onClick={() => setOpenModal(true)} />
                        </div>
                    </div>
                </div>
            </div>

            {openModal &&
                <AllPostModal></AllPostModal>
            }
        </>
    )
}


