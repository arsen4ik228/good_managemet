import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import classes from './ArchiveDialog.module.css'
import { useConvertsHook, useMessages } from '@hooks';
import { useParams } from 'react-router-dom';
import { Message } from '@Custom/Message/Message';
// import Input from './Input';
import { notEmpty } from '@helpers/helpers'
import { debounce } from 'lodash';
import { useSocket, useEmitSocket } from '@helpers/SocketContext';
import AdaptiveLayoutContainer from '../adaptive.container/AdaptiveLayoutContainer';
import AddedWatcherContainer from '@Custom/AddedWatcherContainer/AddedWatcherContainer';
import ConvertTargetContainer from '@Custom/ConvertTargetContainer/ConvertTargetContainer';

export default function ArchiveDialog() {
    const { convertId } = useParams();
    const [paginationSeenMessages, setPaginationSeenMessages] = useState(0);
    const [paginationUnSeenMessages, setPaginationUnSeenMessages] = useState(0);
    const bodyRef = useRef(null);
    const [messagesArray, setMessagesArray] = useState();
    const [socketMessages, setSocketMessages] = useState([]);
    const unSeenMessagesRef = useRef(null);
    const [visibleUnSeenMessageIds, setVisibleUnSeenMessageIds] = useState([]);
    const historySeenIds = []

    const {
        currentConvert,
        senderPostId,
        userIsHost,
        userInfo,
        organizationId,
        senderPostName,
        senderPostForSocket,
        sendMessage,
        refetchGetConvertId,
        isLoadingGetConvertId
    } = useConvertsHook({ convertId });

    const {
        seenMessages,
        unSeenMessageExist,
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
    const unSeenMessageExistRef = useRef(unSeenMessageExist)

    useEmitSocket('join_convert', { convertId: convertId });
    // useEmitSocket('messagesSeen', { convertId: convertId, messageIds: visibleUnSeenMessageIds, post: senderPostForSocket })

    // Инициализация socket подписок 
    const eventNames = useMemo(() => ['messageCreationEvent', 'messagesAreSeen'], []);
    const handleEventData = useCallback((eventName, data) => {
        //(`Data from ${eventName}:`, data);
    }, []);
    const socketResponse = useSocket(eventNames, handleEventData);

    // Слушатель скрола, пагинация запрашиваемых сообщений 
    const handleScroll = debounce(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        const { scrollTop, scrollHeight, clientHeight } = bodyElement;
        if (Math.abs(scrollTop) >= scrollHeight - clientHeight - 200 && !isFetchingSeenMessages && notEmpty(seenMessagesRef.current))
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
        if (!notEmpty(seenMessages)) {
            seenMessagesRef.current = []
            return
        }

        if (!notEmpty(messagesArray)) {
            seenMessagesRef.current = seenMessages;
            setMessagesArray(seenMessages);
        } else {
            seenMessagesRef.current = seenMessages;
            setMessagesArray(prev => [...prev, ...seenMessages]);
        }
    }, [seenMessages]);

    // Создание socket сообщений 
    useEffect(() => {
        if (!notEmpty(socketResponse?.messageCreationEvent)) return;

        const newMessage = socketResponse.messageCreationEvent
        setSocketMessages(prev => [...prev, {
            id: newMessage.id,
            content: newMessage.content,
            userMessage: newMessage.sender.id === senderPostId,
            attachmentToMessages: newMessage.attachmentToMessages,
            timeSeen: null,
            createdAt: newMessage.createdAt,
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
    //             //(socketResponse.messagesAreSeen.messageIds)
    //             if (socketResponse.messagesAreSeen.messageIds.includes(message.id)) {
    //                 //('bam')
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
    //         const updatedMessagesArray = updateMessages(unSeenMessages);
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
        if (!isLoadingUnSeenMessages && unSeenMessages?.length > 0 && unSeenMessagesRef.current) {
            const firstUnSeenMessageElement = unSeenMessagesRef.current;
            const bodyElement = bodyRef.current;
            if (firstUnSeenMessageElement && bodyElement) {
                const offset = firstUnSeenMessageElement.offsetTop;
                bodyElement.scrollTop = offset - 170;
            }
        }
    }, [unSeenMessages, isLoadingUnSeenMessages]);

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
    }, [unSeenMessages, socketMessages]);

    // console.warn(socketMessages)

    return (
        <>
            <AdaptiveLayoutContainer
                userInfo={userInfo}
            >
                <ConvertTargetContainer
                    targetStatus={currentConvert?.target?.targetStatus}
                    targetText={currentConvert?.target ?
                        currentConvert?.target?.content :
                        currentConvert.convertTheme
                    }
                    date={currentConvert?.target?.createdAt}
                    isWatcher={false}
                >
                    {/* {userIsHost && (
                        <AddedWatcherContainer
                            convertId={currentConvert?.id}
                            watchersToConvert={currentConvert?.watchersToConvert}
                        ></AddedWatcherContainer>
                    )} */}
                </ConvertTargetContainer>
                <div className={classes.body} ref={bodyRef}>
                    {socketMessages?.slice().reverse().map((item, index) => (
                        <React.Fragment key={index}>
                            <Message userMessage={item?.userMessage}
                                createdMessage={item?.createdAt}
                                seenStatuses={item?.seenStatuses}
                                attachmentToMessage={item?.attachmentToMessages}
                                {...(!item.userMessage && { 'data-message-id': item.id })}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {unSeenMessages?.length > 0 && (
                        <>
                            {unSeenMessages?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Message
                                        userMessage={item?.userMessage}
                                        createdMessage={item?.createdAt}
                                        ref={index === unSeenMessages?.length - 1 ? unSeenMessagesRef : null}
                                        data-message-id={item.id} // Добавляем data-атрибут
                                        attachmentToMessage={item?.attachmentToMessages}
                                        seenStatuses={item?.seenStatuses}

                                    >
                                        {item.content}
                                    </Message>
                                </React.Fragment>
                            ))}
                            <div className={classes.unSeenMessagesInfo}> Новые сообщения </div>
                        </>
                    )}
                    {messagesArray?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message key={index}
                                userMessage={item?.userMessage}
                                seenStatuses={item?.seenStatuses}
                                senderPost={item?.sender}
                                attachmentToMessage={item?.attachmentToMessages}
                                createdMessage={item?.createdAt}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {isFetchingSeenMessages && <div>Loading more messages...</div>}
                </div>
                <footer className={classes.footer}>
                    {/* <Input
                        convertId={currentConvert?.id}
                        sendMessage={sendMessage}
                        senderPostId={senderPostId}
                        senderPostName={senderPostName}
                        refetchMessages={refetchGetConvertId}
                        isLoadingGetConvertId={isLoadingGetConvertId}
                        organizationId={organizationId}
                    /> */}
                </footer>
            </AdaptiveLayoutContainer>
        </>
    );
}
