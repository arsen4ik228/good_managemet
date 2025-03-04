import React from 'react'
import classes from './Message.module.css'
import { extractHoursMinutes } from '@helpers/helpers'

export const Message = ({ children, userMessage, createdMessage }) => {

    return (
        <>
            <div className={classes.wrapper} style={{ justifyContent: userMessage ? 'flex-end' : 'flex-start' }}>
                <div className={userMessage ? classes.userMessageContainer : classes.messageContainer}>
                    <div className={classes.contentMessage}>
                        <div className={classes.textMessage}>
                            {children}
                        </div>
                        <div className={classes.time}>
                            {extractHoursMinutes(createdMessage)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
