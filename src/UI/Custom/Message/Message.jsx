import React from 'react';
import classes from './Message.module.css';
import { extractHoursMinutes } from '@helpers/helpers';
import isSeenIcon from '@image/isSeen.svg'
import notSeenIcon from '@image/notSeen.svg'
import FilesMessages from './FilesMessages';

export const Message = React.forwardRef(({ userMessage, seenStatuses, createdMessage, timeSeen, children, attachmentToMessage, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={classes.wrapper}
            style={{ justifyContent: userMessage ? 'flex-end' : 'flex-start' }}
            {...props} // Передаем все пропсы, включая data-message-id
        >
            <div className={userMessage ? classes.userMessageContainer : classes.messageContainer}>
                {
                    attachmentToMessage?.length > 0 
                    ? (<FilesMessages attachmentToMessage={attachmentToMessage}></FilesMessages>) 
                    : (null)
                }
                <div className={classes.contentMessage}>
                    <div className={classes.textMessage}>
                        {children}
                    </div>
                    <div className={classes.time}>
                        {extractHoursMinutes(createdMessage)}
                    </div>
                    {userMessage && (
                        <div className={classes.isSeen}>
                            <img src={seenStatuses?.length>0 ? isSeenIcon : notSeenIcon} alt="isSeen" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});