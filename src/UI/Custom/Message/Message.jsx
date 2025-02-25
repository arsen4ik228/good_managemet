import React from 'react'
import classes from './Message.module.css'

export const Message = ({ children, userMessage }) => {

    return (
        <>
            <div className={classes.wrapper} style={{ justifyContent: userMessage ? 'flex-end' : 'flex-start' }}>
                <div className={userMessage ? classes.userMessageContainer : classes.messageContainer}>
                    <div className={classes.contentMessage}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
