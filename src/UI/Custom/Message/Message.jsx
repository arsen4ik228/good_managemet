import React from 'react';
import classes from './Message.module.css';
import { extractHoursMinutes } from '@helpers/helpers';
import isSeenIcon from '@image/isSeen.svg'
import notSeenIcon from '@image/notSeen.svg'

export const Message = React.forwardRef(({ userMessage, createdMessage, timeSeen, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={classes.wrapper}
            style={{ justifyContent: userMessage ? 'flex-end' : 'flex-start' }}
            {...props} // Передаем все пропсы, включая data-message-id
        >
            <div className={userMessage ? classes.userMessageContainer : classes.messageContainer}>
                <div className={classes.contentMessage}>
                    <div className={classes.textMessage}>
                        {children}
                    </div>
                    <div className={classes.time}>
                        {extractHoursMinutes(createdMessage)}
                    </div>
                    {userMessage && (
                        <div className={classes.isSeen}>
                            <img src={timeSeen ? isSeenIcon : notSeenIcon} alt="isSeen" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});