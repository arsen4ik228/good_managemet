import React, { useLayoutEffect, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import classes from './WatcherDialogPage.module.css';
import { useConvertsHook, useMessages, useUnseenMessages } from '@hooks';
import { useParams } from 'react-router-dom';
import { Message } from '@Custom/Message/Message';
import { notEmpty } from '@helpers/helpers'
import { debounce } from 'lodash';
import { useSocket, useEmitSocket } from '@helpers/SocketContext';

import HandlerQeury from "@Custom/HandlerQeury.jsx";
import MainContentContainer from '../../../Custom/MainContentContainer/MainContentContainer';
import ChatContainer from '../ChatContainer/ChatContainer';
import FinalConvertModal from '@Custom/FinalConvertModal/FinalConvertModal'
import ApproveConvertModal from '../../../Custom/FinalConvertModal/ApproveConvertModal';
import AddedWatcherContainer from '@Custom/AddedWatcherContainer/AddedWatcherContainer.jsx'



export default function WatcherDialogPage() {
    const { convertId } = useParams();
    const [paginationSeenMessages, setPaginationSeenMessages] = useState(0);
    const bodyRef = useRef(null);
    const [messagesArray, setMessagesArray] = useState();
    const [socketMessages, setSocketMessages] = useState([]);
    const unSeenMessagesRef = useRef(null);
    const [visibleUnSeenMessageIds, setVisibleUnSeenMessageIds] = useState([]);
    const [lastSeenMessageNumber, setLastSeenMessageNumber] = useState(0)
    const globalHistorySeenIds = []

    const [openFinishModal, setOpenFinishModal] = useState()
    const [openAgreementModal, setOpenAgreementModal] = useState()

    const {
        currentConvert,
        recipientPost,
        userInfo,
        watcherPostForSocket,
        isLoadingGetConvertId,
        pathOfUsers,
        isFetchingGetConvartId,
        isErrorGetConvertId,
    } = useConvertsHook({ convertId });

    const {
        watcherSeenMessages,
        // watcherUnseenMessages,
        // isLoadingWatcherUnSeenMessages,
        // isFetchingWatcherSeenMessages,
        watcherUnseenMessageExist,

    } = useMessages(convertId, paginationSeenMessages);


    const {
        watcherUnseenMessages,
        isLoadingWatcherUnSeenMessages,
        isFetchingWatcherSeenMessages,
    } = useUnseenMessages(convertId)

    const seenMessagesRef = useRef(watcherSeenMessages);
    const unSeenMessageExistRef = useRef(watcherUnseenMessageExist)

    useEmitSocket('join_convert', { convertId: convertId });
    // useEmitSocket('messagesSeenWatcher',
    //     {
    //         convertId: convertId,
    //         messageIds: visibleUnSeenMessageIds,
    //         post: watcherPostForSocket,
    //         lastSeenMessageNumber: lastSeenMessageNumber
    //     })

    // Инициализация socket подписок 
    const eventNames = useMemo(() => ['messageCreationEvent'], []);
    const handleEventData = useCallback((eventName, data) => {
        //(`Data from ${eventName}:`, data);
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

    const cutOfHistoryIds = (socket, visible, history, initial) => {
        // Очищаем socket перед заполнением
        socket.length = 0;

        // Если история пуста, все visible ID - новые
        if (history.length === 0 || initial) {
            socket.push(...visible);
            return;
        }

        // Фильтруем visible, оставляя только те ID, которых нет в history
        for (const id of visible) {
            if (!history.includes(id)) {
                socket.push(id);
            }
        }
    };

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
                const historySeenIds = []
                const messageForSocket = []
                let isInitial = true
                entries.forEach((entry) => {
                    const messageId = entry.target.dataset.messageId;
                    const messageNumber = entry.target.dataset.messageNumber
                    if (entry.isIntersecting && !historySeenIds.includes(messageId)) {
                        // Добавляем id в массив, если элемент видим и его еще нет в historySeenIds
                        visibleIds.push(messageId);
                        cutOfHistoryIds(messageForSocket, visibleIds, historySeenIds, isInitial)
                        historySeenIds.push(messageId);
                        testFunction(messageNumber, setLastSeenMessageNumber)
                    }
                });
                //('observer', historySeenIds)
                // Обновляем состояние массива visibleUnSeenMessageIds
                // setVisibleUnSeenMessageIds(cutOfHistoryIds(visibleIds, historySeenIds));
                setVisibleUnSeenMessageIds(messageForSocket)
                isInitial = false
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

    //(socketResponse?.messageCreationEvent)
    console.warn(watcherUnseenMessages, messagesArray)


    return (
        // <>

        //         <div className={classes.body} ref={bodyRef}>
        //             {socketMessages?.slice().reverse().map((item, index) => (
        //                 <React.Fragment key={index}>
        //                     <Message
        //                         userMessage={item?.userMessage}
        //                         createdMessage={item?.createdAt}
        //                         seenStatuses={item?.seenStatuses}
        //                         data-message-id={item.id}
        //                         data-message-number={item?.messageNumber}
        //                         attachmentToMessage={item?.attachmentToMessages}
        //                         senderPostName={item?.senderPostName}
        //                     >
        //                         {item.content}
        //                     </Message>
        //                 </React.Fragment>
        //             ))}
        //             {watcherUnseenMessages?.length > 0 && (
        //                 <>
        //                     {watcherUnseenMessages?.map((item, index) => (
        //                         <React.Fragment key={index}>
        //                             <Message
        //                                 userMessage={item?.sender?.id === currentConvert?.host?.id}
        //                                 createdMessage={item?.createdAt}
        //                                 ref={index === watcherUnseenMessages.length - 1 ? unSeenMessagesRef : null}
        //                                 data-message-id={item?.id} // Добавляем data-атрибут
        //                                 data-message-number={item.messageNumber}
        //                                 attachmentToMessage={item?.attachmentToMessages}
        //                                 seenStatuses={item?.seenStatuses}
        //                                 senderPostName={item?.sender?.postName}
        //                             >
        //                                 {item.content}
        //                             </Message>
        //                         </React.Fragment>
        //                     ))}
        //                     <div className={classes.unSeenMessagesInfo}> Непрочитанные сообщения </div>
        //                 </>
        //             )}
        //             {messagesArray?.map((item, index) => (
        //                 <React.Fragment key={index}>
        //                     <Message key={index}
        //                         userMessage={item?.sender?.id === currentConvert?.host?.id}
        //                         seenStatuses={item?.seenStatuses}
        //                         senderPost={item?.sender}
        //                         attachmentToMessage={item?.attachmentToMessages}
        //                         createdMessage={item?.createdAt}
        //                         senderPostName={item?.sender?.postName}
        //                     >
        //                         {item.content}
        //                     </Message>
        //                 </React.Fragment>
        //             ))}
        //         </div>

        // </>

        <>
            <MainContentContainer //buttons={buttons}
                // component={<AddedWatcherContainer convertId={convertId} watchersToConvert={currentConvert?.watchersToConvert}
                // ></AddedWatcherContainer>
                // }
                >
               
                <ChatContainer isArchive={true}>
                    {/* <div className={classes.main}> */}
                    <div className={classes.body} ref={bodyRef}>
                        {socketMessages?.slice().reverse().map((item, index) => (
                            <React.Fragment key={index}>
                                <Message
                                    userMessage={item?.userMessage}
                                    createdMessage={item?.createdAt}
                                    seenStatuses={item?.seenStatuses}
                                    data-message-id={item.id}
                                    data-message-number={item?.messageNumber}
                                    attachmentToMessage={item?.attachmentToMessages}
                                    senderPostName={item?.senderPostName}
                                    avatar={item?.sender.user.avatar_url}
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
                                            data-message-id={item?.id} // Добавляем data-атрибут
                                            data-message-number={item.messageNumber}
                                            attachmentToMessage={item?.attachmentToMessages}
                                            seenStatuses={item?.seenStatuses}
                                            senderPostName={item?.sender?.postName}
                                            avatar={item?.sender.user.avatar_url}
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
                                    avatar={item?.sender.user.avatar_url}
                                >
                                    {item.content}
                                </Message>
                            </React.Fragment>
                        ))}
                    </div>
                    {/* </div> */}
                </ChatContainer>
                {/* 
            {<footer className={classes.footer}>
                    <Input
                        convertId={currentConvert?.id}
                        sendMessage={sendMessage}
                        senderPostId={senderPostId}
                        senderPostName={senderPostName}
                        refetchMessages={refetchGetConvertId}
                        isLoadingGetConvertId={isLoadingGetConvertId}
                        organizationId={organizationId}
                    />
                </footer>
            } */}

                {openFinishModal && (
                    <FinalConvertModal
                        setOpenModal={setOpenFinishModal}
                        convertId={convertId}
                        pathOfUsers={pathOfUsers}
                        targetId={currentConvert?.target?.id}
                    ></FinalConvertModal>
                )}
                {openAgreementModal && (
                    <ApproveConvertModal
                        setOpenModal={setOpenAgreementModal}
                        convertId={convertId}
                    >
                    </ApproveConvertModal>
                )}

                <HandlerQeury
                    Error={isErrorGetConvertId}
                    Loading={isLoadingGetConvertId}
                    Fetching={isFetchingGetConvartId}
                />
            </MainContentContainer>
        </>
    );
};