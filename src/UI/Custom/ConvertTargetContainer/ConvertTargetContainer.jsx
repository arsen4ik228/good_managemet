import React, { useState } from 'react'
import classes from './ConvertTargetContainer.module.css'
import { formattedDate } from '@helpers/helpers'
import FinalConvertModal from '../FinalConvertModal/FinalConvertModal'

export default function ConvertTargetContainer({ children, targetStatus, targetText, date, isHost, convertId, pathOfUsers }) {
    const [openFinishModal, setOpenFinishModal] = useState(false)

    const handleClick = () => {
        if (!isHost) return;

        setOpenFinishModal(true)
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.topContainer}>
                    <div className={classes.checkboxContainer}>
                        <input
                            type="checkbox"
                            onClick={() => handleClick()}
                            checked={targetStatus === 'Завершена'}
                            readOnly={!isHost}
                        />
                    </div>
                    <div className={classes.targetContainer}>
                        <div className={classes.targetText}>
                            {targetText}
                        </div>
                    </div>
                    <div className={classes.dateContainer}>
                        <span>
                            {formattedDate(date)}
                        </span>
                    </div>
                </div>
                {children && (
                    <div className={classes.bottomContainer}>
                        {children}
                    </div>
                )}
            </div>

            {openFinishModal && (
                <FinalConvertModal
                setOpenModal={setOpenFinishModal}
                convertId={convertId}
                pathOfUsers={pathOfUsers}
                ></FinalConvertModal>
            )}
        </>
    )
}
