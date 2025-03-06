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
    const [paginationSeenMessages, setPaginationSeenMessages] = useState(0); // Состояние для пагинации
    const [paginationUnSeenMessages, setPaginationUnSeenMessages] = useState(0); // Состояние для пагинации
    const bodyRef = useRef(null); // Ref для блока body
    const [messagesArray, setMessagesArray] = useState()
    const [socketMessages, setSocketMessages] = useState([])
    const unSeenMessagesRef = useRef(null);

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
    } = useMessages(convertId, paginationSeenMessages); // Используем useMessages с pagination
    const seenMessagesRef = useRef(seenMessages);

    useEmitSocket('join_convert', { convertId: convertId });
    //useEmitSocket('messagesSeen', { convertId: convertId, messageIds: unSeenMessagesIds })

    const eventNames = useMemo(() => ['messageCreationEvent'], []);

    const handleEventData = useCallback((eventName, data) => {
        console.log(`Data from ${eventName}:`, data);

    }, []); // Мемоизация callback

    const socketResponse = useSocket(eventNames, handleEventData);


    const handleScroll = debounce(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        const { scrollTop, scrollHeight, clientHeight } = bodyElement;
        console.log(scrollTop, scrollHeight, clientHeight, seenMessagesRef.current);
        if (Math.abs(scrollTop) >= scrollHeight - clientHeight - 200 && !isFetchingSeenMessages && notEmpty(seenMessagesRef.current))
            setPaginationSeenMessages((prev) => prev + 30);

    }, 200);

    // Добавляем обработчик скролла при монтировании компонента
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
                setMessagesArray(seenMessages)
            }
            else {
                seenMessagesRef.current = seenMessages;
                setMessagesArray(prev => [...prev, ...seenMessages])
            }
        }
    }, [seenMessages])

    useEffect(() => {
        if (!notEmpty(socketResponse)) return

        console.log('transform socketMessages', socketResponse)
        setSocketMessages(prev => [...prev, {
            content: socketResponse.content,
            userMessage: socketResponse.sender.id === senderPostId,
            createdAt: socketResponse.createdAt
        }])
    }, [socketResponse])

        // Управление скроллом при загрузке страницы
        useLayoutEffect(() => {
            console.warn(unSeenMessages.length > 0, unSeenMessagesRef.current)
        if (unSeenMessages.length > 0 && unSeenMessagesRef.current) {
            const firstUnSeenMessageElement = unSeenMessagesRef.current;
            const bodyElement = bodyRef.current;
            console.warn(firstUnSeenMessageElement, bodyElement)
            if (firstUnSeenMessageElement && bodyElement) {
                const offset = firstUnSeenMessageElement.offsetTop;
                bodyElement.scrollTop = offset;
            }
        }
    }, [unSeenMessages, messagesArray]);

    // useEffect(() => { }, [unSeenMessagesIds])
    console.log(unSeenMessages)
    console.log(unSeenMessagesIds)
    // console.log(unSeenMessagesIds)
    // console.log(socketMessages)
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
                            <Message userMessage={item?.userMessage} createdMessage={item?.createdAt}>
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {unSeenMessages.length > 0 && (
                        <>
                            {unSeenMessages?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Message userMessage={item?.userMessage} createdMessage={item?.createdAt} ref={index === 0 ? unSeenMessagesRef : null}>
                                        {item.content}
                                    </Message>
                                </React.Fragment>
                            ))}
                            <div className={classes.unSeenMessagesInfo}> Непрочитанные сообщения </div>
                        </>
                    )}
                    {messagesArray?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message userMessage={item?.userMessage} createdMessage={item?.createdAt}>
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


