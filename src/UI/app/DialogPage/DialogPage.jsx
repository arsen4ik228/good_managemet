import React, { useLayoutEffect, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import classes from './DialogPage.module.css';
import Header from "@Custom/CustomHeader/Header";
import { useConvertsHook, useMessages } from '@hooks';
import { useParams } from 'react-router-dom';
import { Message } from '@Custom/Message/Message';
import Input from './Input';
import { notEmpty } from '@helpers/helpers'
import { debounce } from 'lodash';
import { useSocket, useEmitSocket } from '@helpers/SocketContext';

export const DialogPage = () => {
    const { convertId } = useParams();
    const [paginationSeenMessages, setPaginationSeenMessages] = useState(0);
    const [paginationUnSeenMessages, setPaginationUnSeenMessages] = useState(0);
    const bodyRef = useRef(null);
    const [messagesArray, setMessagesArray] = useState();
    const [socketMessages, setSocketMessages] = useState([]);
    const unSeenMessagesRef = useRef(null);
    const [visibleUnSeenMessageIds, setVisibleUnSeenMessageIds] = useState([]);
    const historySeenIds = []

    const { currentConvert, senderPostId, userInfo, senderPostName, sendMessage, refetchGetConvertId, isLoadingGetConvertId } = useConvertsHook(convertId);
    const {
        seenMessages,
        isLoadingSeenMessages,
        isErrorSeenMessages,
        isFetchingSeenMessages,
        unSeenMessages,
        unSeenMessagesIds,
        isLoadingUnSeenMessages,
        isErrorUnSeenMessages,
        isFetchingUnSeenMessages,
    } = useMessages(convertId, paginationSeenMessages);
    const seenMessagesRef = useRef(seenMessages);

    useEmitSocket('join_convert', { convertId: convertId });
    useEmitSocket('messagesSeen', { convertId: convertId, messageIds: visibleUnSeenMessageIds })

    const eventNames = useMemo(() => ['messageCreationEvent'], []);
    const handleEventData = useCallback((eventName, data) => {
        console.log(`Data from ${eventName}:`, data);
    }, []);

    const socketResponse = useSocket(eventNames, handleEventData);

    const handleScroll = debounce(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        const { scrollTop, scrollHeight, clientHeight } = bodyElement;
        if (Math.abs(scrollTop) >= scrollHeight - clientHeight - 200 && !isFetchingSeenMessages && notEmpty(seenMessagesRef.current))
            setPaginationSeenMessages((prev) => prev + 30);
    }, 200);

    useLayoutEffect(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) {
            console.error('Body element is not found!');
            return;
        }

        bodyElement.addEventListener('scroll', handleScroll);
        return () => {
            bodyElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (notEmpty(seenMessages)) {
            if (!notEmpty(messagesArray)) {
                seenMessagesRef.current = seenMessages;
                setMessagesArray(seenMessages);
            } else {
                seenMessagesRef.current = seenMessages;
                setMessagesArray(prev => [...prev, ...seenMessages]);
            }
        }
    }, [seenMessages]);

    useEffect(() => {
        if (!notEmpty(socketResponse)) return;

        setSocketMessages(prev => [...prev, {
            id: socketResponse.id,
            content: socketResponse.content,
            userMessage: socketResponse.sender.id === senderPostId,
            createdAt: socketResponse.createdAt
        }]);
    }, [socketResponse]);

    useLayoutEffect(() => {
        if (!isLoadingUnSeenMessages && unSeenMessages.length > 0 && unSeenMessagesRef.current) {
            const firstUnSeenMessageElement = unSeenMessagesRef.current;
            const bodyElement = bodyRef.current;
            if (firstUnSeenMessageElement && bodyElement) {
                const offset = firstUnSeenMessageElement.offsetTop;
                bodyElement.scrollTop = offset - 150;
            }
        }
    }, [unSeenMessages, messagesArray, unSeenMessagesRef.current, isLoadingUnSeenMessages]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Создаем временный массив для хранения id видимых элементов
                const visibleIds = [];

                entries.forEach((entry) => {
                    const messageId = entry.target.dataset.messageId;
                    if (entry.isIntersecting && !historySeenIds.includes(messageId)) {
                        // Добавляем id в массив, если элемент видим и его еще нет в historySeenIds
                        visibleIds.push(messageId);
                        historySeenIds.push(messageId);
                    }
                });

                // Обновляем состояние массива visibleUnSeenMessageIds
                setVisibleUnSeenMessageIds(visibleIds);
            },
            {
                root: bodyRef.current, // Область видимости — это контейнер сообщений
                threshold: 0.4,
            }
        );

        // Находим все элементы с data-message-id и начинаем их отслеживать
        const messageElements = bodyRef.current.querySelectorAll('[data-message-id]');
        messageElements.forEach((element) => observer.observe(element));

        // Очистка при размонтировании
        return () => {
            messageElements.forEach((element) => observer.unobserve(element));
            observer.disconnect();
        };
    }, [unSeenMessages, socketMessages]); // Зависимость от unSeenMessages и socketMessages

    //setVisibleUnSeenMessageIds(visibleIds);

    console.log('Visible unSeenMessages IDs:', visibleUnSeenMessageIds);
    console.log(socketMessages)
    return (
        <>
            <div className={classes.wrapper}>
                <Header
                    title={userInfo.userName}
                    avatar={userInfo.avatar}
                >
                    {userInfo.postName}
                </Header>
                <div className={classes.body} ref={bodyRef}>
                    {socketMessages.slice().reverse().map((item, index) => (
                        <React.Fragment key={index}>
                            <Message userMessage={item?.userMessage}
                                createdMessage={item?.createdAt}
                                {...(!item.userMessage && { 'data-message-id': item.id })}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {unSeenMessages.length > 0 && (
                        <>
                            {unSeenMessages?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Message
                                        userMessage={item?.userMessage}
                                        createdMessage={item?.createdAt}
                                        ref={index === unSeenMessages.length - 1 ? unSeenMessagesRef : null}
                                        data-message-id={item.id} // Добавляем data-атрибут
                                    >
                                        {item.id}
                                    </Message>
                                </React.Fragment>
                            ))}
                            <div className={classes.unSeenMessagesInfo}> Непрочитанные сообщения </div>
                        </>
                    )}
                    {messagesArray?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message userMessage={item?.userMessage} createdMessage={item?.createdAt} >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {isFetchingSeenMessages && <div>Loading more messages...</div>}
                </div>
                <footer className={classes.footer}>
                    <Input
                        convertId={currentConvert?.id}
                        sendMessage={sendMessage}
                        senderPostId={senderPostId}
                        senderPostName={senderPostName}
                        refetchMessages={refetchGetConvertId}
                        isLoadingGetConvertId={isLoadingGetConvertId}
                    />
                </footer>
            </div>
        </>
    );
};