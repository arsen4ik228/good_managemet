import React, { useLayoutEffect, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import classes from './WatcherDialogPage.module.css';
import Header from "@Custom/CustomHeader/Header";
import { useConvertsHook, useMessages } from '@hooks';
import { useParams } from 'react-router-dom';
import { Message } from '@Custom/Message/Message';
import { notEmpty } from '@helpers/helpers'
import { debounce } from 'lodash';
import { useSocket, useEmitSocket } from '@helpers/SocketContext';
import ConvertTargetContainer from '@Custom/ConvertTargetContainer/ConvertTargetContainer';
import AdaptiveLayoutContainer from './adaptive.container/AdaptiveLayoutContainer';

export default function WatcherDialogPage() {
    const { convertId } = useParams();
    const [paginationSeenMessages, setPaginationSeenMessages] = useState(0);
    const bodyRef = useRef(null);
    const [messagesArray, setMessagesArray] = useState();
    const [socketMessages, setSocketMessages] = useState([]);
    const unSeenMessagesRef = useRef(null);
    const [visibleUnSeenMessageIds, setVisibleUnSeenMessageIds] = useState([]);
    const [lastSeenMessageNumber, setLastSeenMessageNumber] = useState(0)
    const historySeenIds = []

    const {
        currentConvert,
        recipientPost,
        userInfo,
        watcherPostForSocket,
        isLoadingGetConvertId
    } = useConvertsHook({ convertId });

    const {
        watcherSeenMessages,
        watcherUnseenMessages,
        isLoadingWatcherUnSeenMessages,
        isFetchingWatcherSeenMessages,
        watcherUnseenMessageExist,

    } = useMessages(convertId, paginationSeenMessages);
    const seenMessagesRef = useRef(watcherSeenMessages);
    const unSeenMessageExistRef = useRef(watcherUnseenMessageExist)

    useEmitSocket('join_convert', { convertId: convertId });
    useEmitSocket('messagesSeenWatcher',
        {
            convertId: convertId,
            messageIds: visibleUnSeenMessageIds,
            post: watcherPostForSocket,
            lastSeenMessageNumber: lastSeenMessageNumber
        })

    // Инициализация socket подписок 
    const eventNames = useMemo(() => ['messageCreationEvent'], []);
    const handleEventData = useCallback((eventName, data) => {
        console.log(`Data from ${eventName}:`, data);
    }, []);
    const socketResponse = useSocket(eventNames, handleEventData);


    const createTestFunction = () => {
        let prevValue = 0;

        return (number, setNewValue) => {

            if (+prevValue < +number) {
                prevValue = number;
                setNewValue(number);
            }

        };
    };
    const testFunction = createTestFunction();

    // Слушатель скрола, пагинация запрашиваемых сообщений 
    const handleScroll = debounce(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        const { scrollTop, scrollHeight, clientHeight } = bodyElement;
        if (Math.abs(scrollTop) >= scrollHeight - clientHeight - 200 && !isFetchingWatcherSeenMessages && notEmpty(seenMessagesRef.current))
            setPaginationSeenMessages((prev) => prev + 30);

    }, 200);

    // Монтирование слушателя скрола
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

    // Компоновка массива архивных сообщений 
    useEffect(() => {
        if (!notEmpty(watcherSeenMessages)) {
            seenMessagesRef.current = []
            return
        }

        if (!notEmpty(messagesArray)) {
            seenMessagesRef.current = watcherSeenMessages;
            setMessagesArray(watcherSeenMessages);
        } else {
            seenMessagesRef.current = watcherSeenMessages;
            setMessagesArray(prev => [...prev, ...watcherSeenMessages]);
        }

    }, [watcherSeenMessages]);

    // Создание socket сообщений 
    useEffect(() => {
        if (!notEmpty(socketResponse?.messageCreationEvent)) return;

        const newMessage = socketResponse.messageCreationEvent
        setSocketMessages(prev => [...prev, {
            id: newMessage.id,
            content: newMessage.content,
            userMessage: newMessage.sender.id === currentConvert?.host.id,
            attachmentToMessage: newMessage.attachmentToMessage,
            timeSeen: null,
            messageNumber: newMessage.messageNumber,
            createdAt: newMessage.createdAt,
            senderPostName: newMessage.sender.postName
        }]);
    }, [socketResponse?.messageCreationEvent]);

    // Прочтение сообщений(смена статуса)
    // useEffect(() => {
    //     // Проверяем, что socketResponse.messagesAreSeen и messageIds существуют
    //     if (!socketResponse?.messagesAreSeen || !Array.isArray(socketResponse.messagesAreSeen.messageIds)) {
    //         return;
    //     }

    //     // Функция для обновления сообщений
    //     const updateMessages = (messages) => {
    //         return messages.map(message => {
    //             console.log(socketResponse.messagesAreSeen.messageIds)
    //             if (socketResponse.messagesAreSeen.messageIds.includes(message.id)) {
    //                 console.log('bam')
    //                 return {
    //                     ...message,
    //                     seenStatuses: ['isSeen']  // socketResponse.messagesAreSeen.dateSeen,
    //                 };
    //             }
    //             return message;
    //         });
    //     };

    //     // Обновляем messagesArray, если есть непрочитанные сообщения
    //     if (unSeenMessageExistRef.current) {
    //         const updatedMessagesArray = updateMessages(watcherUnseenMessages);
    //         const hasUnSeenMessages = updatedMessagesArray.some(message =>
    //             socketResponse.messagesAreSeen.messageIds.includes(message.id)
    //         );

    //         if (hasUnSeenMessages) {
    //             setMessagesArray(updatedMessagesArray);
    //         } else {
    //             unSeenMessageExistRef.current = false;
    //         }
    //     }

    //     // Обновляем socketMessages
    //     const updatedSocketMessages = updateMessages(socketMessages);
    //     setSocketMessages(updatedSocketMessages);
    // }, [socketResponse?.messagesAreSeen, unSeenMessageExist]);


    // Установка фокуса на не прочитанные сообщения 
    useLayoutEffect(() => {
        if (!isLoadingWatcherUnSeenMessages && watcherUnseenMessages?.length > 0 && unSeenMessagesRef.current) {
            const firstUnSeenMessageElement = unSeenMessagesRef.current;
            const bodyElement = bodyRef.current;
            if (firstUnSeenMessageElement && bodyElement) {
                const offset = firstUnSeenMessageElement.offsetTop;
                bodyElement.scrollTop = offset - 170;
            }
        }
    }, [watcherUnseenMessages, isLoadingWatcherUnSeenMessages]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Создаем временный массив для хранения id видимых элементов
                const visibleIds = [];

                entries.forEach((entry) => {
                    const messageId = entry.target.dataset.messageId;
                    const messageNumber = entry.target.dataset.messageNumber
                    if (entry.isIntersecting && !historySeenIds.includes(messageId)) {
                        // Добавляем id в массив, если элемент видим и его еще нет в historySeenIds
                        visibleIds.push(messageId);
                        historySeenIds.push(messageId);
                        testFunction(messageNumber, setLastSeenMessageNumber)
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
    }, [watcherUnseenMessages, socketMessages]);

    console.log(socketResponse?.messageCreationEvent)

    return (
        <>
            <AdaptiveLayoutContainer
                userInfo={userInfo}
            >
                <ConvertTargetContainer
                    targetStatus={currentConvert?.target?.targetStatus}
                    targetText={currentConvert?.target?.content}
                    date={currentConvert?.target?.createdAt}
                    isWatcher={true}
                >
                    <div className={classes.recepientPost}>
                        <span>получатель:</span> {recipientPost.postName}
                    </div>
                </ConvertTargetContainer>
                <div className={classes.body} ref={bodyRef}>
                    {socketMessages?.slice().reverse().map((item, index) => (
                        <React.Fragment key={index}>
                            <Message
                                userMessage={item?.sender?.id === currentConvert?.host?.id}
                                createdMessage={item?.createdAt}
                                seenStatuses={item?.seenStatuses}
                                data-message-number={item.messageNumber}
                                attachmentToMessage={item?.attachmentToMessages}
                                senderPostName={item?.senderPostName}
                                {...(!item.userMessage && { 'data-message-id': item.id })}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {watcherUnseenMessages?.length > 0 && (
                        <>
                            {watcherUnseenMessages?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Message
                                        userMessage={item?.sender?.id === currentConvert?.host?.id}
                                        createdMessage={item?.createdAt}
                                        ref={index === watcherUnseenMessages.length - 1 ? unSeenMessagesRef : null}
                                        data-message-id={item.id} // Добавляем data-атрибут
                                        data-message-number={item.messageNumber}
                                        attachmentToMessage={item?.attachmentToMessages}
                                        seenStatuses={item?.seenStatuses}
                                        senderPostName={item?.sender?.postName}
                                    >
                                        {item.content}
                                    </Message>
                                </React.Fragment>
                            ))}
                            <div className={classes.unSeenMessagesInfo}> Непрочитанные сообщения </div>
                        </>
                    )}
                    {messagesArray?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message key={index}
                                userMessage={item?.sender?.id === currentConvert?.host?.id}
                                seenStatuses={item?.seenStatuses}
                                senderPost={item?.sender}
                                attachmentToMessage={item?.attachmentToMessages}
                                createdMessage={item?.createdAt}
                                senderPostName={item?.sender?.postName}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                </div>
                <footer className={classes.footer}>
                    {/* <Input
                        convertId={currentConvert?.id}
                        sendMessage={sendMessage}
                        senderPostId={senderPostId}
                        senderPostName={senderPostName}
                        refetchMessages={refetchGetConvertId}
                        isLoadingGetConvertId={isLoadingGetConvertId}
                    /> */}
                </footer>
            </AdaptiveLayoutContainer>
        </>
    );
};