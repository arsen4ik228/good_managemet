import React, { useEffect, useState } from 'react';
import classes from './Message.module.css';
import { extractHoursMinutes, formatDateTime } from '@helpers/helpers';
import isSeenIcon from '@image/isSeen.svg'
import notSeenIcon from '@image/notSeen.svg'
import FilesMessages from './FilesMessages';
import { baseUrl } from '@helpers/constants'
import default_avatar from '@image/default_avatar.svg'
import ImageGrig from './ImageGrig';
import helper_medium from '@image/helper_icon.svg'
import { useParams } from 'react-router-dom';
import { formattedDate } from '@helpers/helpers'

const transformText = (text, setIsFinalMessage, organizationId) => {

    // Проверка на специальный маркер
    if (text === '$&#ПриказСогласован$&#1') {
        setIsFinalMessage(true)
        return;
    }

    // Функция для проверки UUID
    const isUUID = (str) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    };

    // Разбиваем текст на слова
    const words = text.split(' ');
    const firstWord = words[0]; // Тип: "Проект" или "Программа"
    const secondWord = words[1]; // ID
    const restOfText = words.slice(2).join(' ');

    const baseUrl = process.env.REACT_APP_LINK_URL || '';

    // Проверяем формат: тип (Проект/Программа) + UUID + остальной текст
    if ((firstWord === 'Проект' || firstWord === 'Программа') &&
        secondWord && isUUID(secondWord)) {

        // Определяем путь в зависимости от типа
        const path = firstWord === 'Проект'
            ? `/helper/project/${secondWord}`
            : `/helper/program/${secondWord}`;

        return (
            <div style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.4'
            }}>
                {restOfText && restOfText + ' '}
                <a
                    href={`${baseUrl}#/${organizationId}${path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontStyle: 'italic', borderBottom: '1px solid' }}
                >
                    Перейти к {firstWord === 'Проект' ? 'Проекту' : 'Прорамме'}
                </a>
            </div>
        );
    }

    // Проверяем, является ли первое слово UUID (старый формат)
    if (isUUID(firstWord)) {
        return (
            <div style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.4'
            }}>
                <a
                    href={`${baseUrl}#/${organizationId}/helper/project/${firstWord}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Проект
                </a>
                {restOfText && ' ' + restOfText}
            </div>
        );
    }

    // Существующая проверка policyId
    const regex = /(.*?)policyId:([^,]+),policyName:([^,]+)(.*)/i;
    const match = text.match(regex);

    if (!match) return (
        <div style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.4'
        }}>
            {text}
        </div>
    );

    const before = match[1];
    const value = match[2];
    const label = match[3];
    const after = match[4].replace(/^,/, '');

    return (
        <div style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.4'
        }}>
            {before}
            <a
                href={`${baseUrl}#/${organizationId}/helper/project/${value}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {label}
            </a>
            {after}
        </div>
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

export const Message = React.forwardRef(({ userMessage, seenStatuses, avatar, senderPostName, createdMessage, updatedAt, timeSeen, children, attachmentToMessage, ...props }, ref) => {

    const [isFinalMessage, setIsFinalMessage] = useState(false)

    const { organizationId } = useParams()

    return (
        <div
            ref={ref}
            className={classes.wrapper}

            {...props} // Передаем все пропсы, включая data-message-id
        >
            <div className={classes.messageContainer}
                style={{
                    justifyContent: userMessage ? 'flex-end' : 'flex-start',
                }}
            >
                {isFinalMessage ? (
                    <>
                        {userMessage && (
                            <div className={classes.userAvatar_receiver}>
                                <img src={helper_medium} alt="ava" />
                            </div>
                        )}

                        <div className={classes.messageWithoutAvatar}>
                            <div className={classes.messageInfo}>
                                {formatDateTime(createdMessage)}
                                {userMessage && (
                                    <img src={seenStatuses?.length > 0 ? isSeenIcon : notSeenIcon} alt="isSeen" />
                                )}
                            </div>
                            <div className={classes.containerForAttachmets}>
                                <div
                                    className={
                                        getVisaClassName(children) || classes.userMessageContainer
                                    }
                                    style={{ "border-radius": userMessage ? "15px 0 15px 0" : 'none' }}
                                >
                                    {/* {
                            attachmentToMessage?.length > 0
                                ? (<FilesMessages attachmentToMessage={attachmentToMessage}></FilesMessages>)
                                : (null)
                        } */}
                                    <div className={classes.senderName}>
                                        {senderPostName}
                                    </div>
                                    <div className={classes.contentMessage}>
                                        <div className={classes.textMessage}>
                                            Коммуникация завершена
                                        </div>
                                        {/* <div className={classes.time}>
                        {extractHoursMinutes(createdMessage)}
                    </div>
                    {userMessage && (
                        <div className={classes.isSeen}>
                            <img src={seenStatuses?.length > 0 ? isSeenIcon : notSeenIcon} alt="isSeen" />
                        </div>
                    )} */}
                                    </div>
                                </div>
                                <div className={classes.attachmentsContainer}>
                                    {
                                        attachmentToMessage?.length > 0
                                            ? (<FilesMessages attachmentToMessage={attachmentToMessage}></FilesMessages>)
                                            : (null)
                                    }

                                    <ImageGrig attachmentToMessage={attachmentToMessage}></ImageGrig>
                                </div>
                            </div>

                        </div>

                        {!userMessage && (
                            <div className={classes.userAvatar}>
                                <img src={helper_medium} alt="ava" />
                            </div>
                        )}
                    </>

                ) : (
                    <>
                        {userMessage && (
                            <div className={classes.userAvatar_receiver}>
                                <img src={avatar ? `${baseUrl}${avatar}` : default_avatar} alt="ava" />
                            </div>
                        )}
                        <div className={classes.messageWithoutAvatar}>
                            {/* {(updatedAt && (createdMessage !== updatedAt)) && (
                                <span style={{ color: 'red' }}>Изменено: {formattedDate(updatedAt)} </span>
                            )} */}
                            <div className={classes.messageInfo}>
                                {(updatedAt && (createdMessage !== updatedAt)) ? (
                                    <>
                                        Изменено: {formatDateTime(updatedAt)}
                                    </>
                                ) : (
                                    formatDateTime(createdMessage)
                                )}
                                {userMessage && (
                                    <img src={seenStatuses?.length > 0 ? isSeenIcon : notSeenIcon} alt="isSeen" />
                                )}
                            </div>
                            <div className={classes.containerForAttachmets}>
                                <div
                                    className={
                                        getVisaClassName(children) || classes.userMessageContainer
                                    }
                                    style={{ "border-radius": userMessage ? "15px 0 15px 0" : 'none' }}
                                >
                                    {/* {
                            attachmentToMessage?.length > 0
                                ? (<FilesMessages attachmentToMessage={attachmentToMessage}></FilesMessages>)
                                : (null)
                        } */}
                                    <div className={classes.senderName}>
                                        {senderPostName}
                                    </div>
                                    <div className={classes.contentMessage}>
                                        <div className={classes.textMessage}>
                                            {transformText(children, setIsFinalMessage, organizationId)}
                                        </div>
                                        {/* <div className={classes.time}>
                        {extractHoursMinutes(createdMessage)}
                    </div>
                    {userMessage && (
                        <div className={classes.isSeen}>
                            <img src={seenStatuses?.length > 0 ? isSeenIcon : notSeenIcon} alt="isSeen" />
                        </div>
                    )} */}
                                    </div>
                                </div>
                                <div className={classes.attachmentsContainer}>
                                    {
                                        attachmentToMessage?.length > 0
                                            ? (<FilesMessages attachmentToMessage={attachmentToMessage}></FilesMessages>)
                                            : (null)
                                    }

                                    <ImageGrig attachmentToMessage={attachmentToMessage}></ImageGrig>
                                </div>
                            </div>

                        </div>
                        {!userMessage && (
                            <div className={classes.userAvatar}>
                                <img src={avatar ? `${baseUrl}${avatar}` : default_avatar} alt="ava" />
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* <div className={classes.attachmentsContainer} style={{ border: '1px solid red' }}>
                {
                    attachmentToMessage?.length > 0
                        ? (<FilesMessages attachmentToMessage={attachmentToMessage}></FilesMessages>)
                        : (null)
                }
            </div> */}


        </div >
    );
});