import React from 'react'
import classes from './Message.module.css'

export const Message = () => {

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.messageContainer}>
                    <div className={classes.contentMessage}>
        хорошо
                    </div>
                </div>
            </div>
            {/* <div className={classes.wrapper}>


                <div className={classes.messageContainer}>
                <div className={classes.invisibleSection}>
                    <div></div>
                    <div></div>
                </div>
                    <div className={classes.contentMessage}>
                        cscscscsscsbbbbbbbb
                    </div>
                </div>
            </div> */}

        </>
    )
}
