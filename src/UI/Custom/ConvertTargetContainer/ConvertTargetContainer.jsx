import React from 'react'
import classes from './ConvertTargetContainer.module.css'

export default function ConvertTargetContainer({ children, targetStatus, targetText, date, isWatcher, handleCompleteTargetClick }) {

    const handleClick = () => {
        if (isWatcher) return;

        console.log('handleClick')
        handleCompleteTargetClick()
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
                        readOnly={isWatcher}
                        />
                    </div>
                    <div className={classes.targetContainer}>
                        <div className={classes.targetText}>
                            {targetText}
                        </div>
                    </div>
                    <div className={classes.dateContainer}>
                        <span>
                           {date} 13.13.13
                        </span>
                    </div>
                </div>
                <div className={classes.bottomContainer}>
                    {children}
                </div>
            </div>
        </>
    )
}
