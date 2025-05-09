import React, { useEffect, useState } from 'react';
import classes from './Message.module.css';
import { extractHoursMinutes } from '@helpers/helpers';
import isSeenIcon from '@image/isSeen.svg'
import notSeenIcon from '@image/notSeen.svg'
import FilesMessages from './FilesMessages';

const transformText = (text) => {
    const regex = /(.*?)policyId:([^,]+),policyName:([^,]+)(.*)/i;
    const match = text.match(regex);

    if (!match) return text; // Если совпадений нет, вернуть исходный текст

    const before = match[1]; // Всё до policyId
    const value = match[2];  // Значение policyId
    const label = match[3];  // Значение policyName
    const after = match[4].replace(/^,/, ''); // Убираем начальную запятую

    return (
        <>
            {before}
            <a href={`#/pomoshnik/policy/${value}`}>{label}</a>
            {after}
        </>
    );
};

const getVisaClassName = (text) => {
    if (text?.startsWith("Приказ согласован: ")) {
        return classes.visaApproved;  // Класс для согласованных
    }
    if (text?.startsWith("Приказ отменён: ")) {
        return classes.visaRejected;  // Класс для отменённых
    }
    return null;  // Если текст не подошёл — вернём null
};

export const Message = React.forwardRef(({ userMessage, seenStatuses, senderPostName, createdMessage, timeSeen, children, attachmentToMessage, ...props }, ref) => {


    return (
        <div
            ref={ref}
            className={classes.wrapper}
            style={{
                justifyContent: userMessage ? 'flex-end' : 'flex-start',
            }}
            {...props} // Передаем все пропсы, включая data-message-id
        >
            <div
                className={
                    getVisaClassName(children) ||
                    (userMessage ? classes.userMessageContainer : classes.messageContainer)
                }
            >
                {
                    attachmentToMessage?.length > 0
                        ? (<FilesMessages attachmentToMessage={attachmentToMessage}></FilesMessages>)
                        : (null)
                }
                <div className={classes.senderName}>
                    {senderPostName}
                </div>
                <div className={classes.contentMessage}>
                    <div className={classes.textMessage}>
                        {transformText(children)}
                    </div>
                    <div className={classes.time}>
                        {extractHoursMinutes(createdMessage)}
                    </div>
                    {userMessage && (
                        <div className={classes.isSeen}>
                            <img src={seenStatuses?.length > 0 ? isSeenIcon : notSeenIcon} alt="isSeen" />
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
});