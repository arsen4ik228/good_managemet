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
    const [pagination, setPagination] = useState(0); // Состояние для пагинации
    const bodyRef = useRef(null); // Ref для блока body
    const [messagesArray, setMessagesArray] = useState()
    const [socketMessages, setSocketMessages] = useState([])

    const { currentConvert, senderPostId, userInfo, senderPostName, sendMessage, refetchGetConvertId, isLoadingGetConvertId } = useConvertsHook(convertId);
    const { messages, isLoading, isError, isFetching } = useMessages(convertId, pagination); // Используем useMessages с pagination

    useEmitSocket('join_convert', { convertId: convertId });

    const eventNames = useMemo(() => ['messageCreationEvent'], []);

    const handleEventData = useCallback((eventName, data) => {
        console.log(`Data from ${eventName}:`, data);

    }, []); // Мемоизация callback

    const socketResponse = useSocket(eventNames, handleEventData);


    const handleScroll = debounce(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        const { scrollTop, scrollHeight, clientHeight } = bodyElement;
        console.log(scrollTop, scrollHeight, clientHeight)
        if ((Math.abs(scrollTop) >= scrollHeight - clientHeight - 200) && !isFetching) {
            setPagination(prev => prev + 30);
        }
    }, 200); // Задержка 200 мс

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
        if (notEmpty(messages)) {
            if (!notEmpty(messagesArray))
                setMessagesArray(messages)
            else
                setMessagesArray(prev => [...prev, ...messages])
        }
    }, [messages])

    useEffect(() => {
        if (!notEmpty(socketResponse)) return

        console.log('transform socketMessages', socketResponse)
        setSocketMessages(prev => [...prev, {
            content: socketResponse.content,
            userMessage: socketResponse.sender.id === senderPostId,
            createdAt: socketResponse.createdAt
        }])
    }, [socketResponse])
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
                            <Message userMessage={item?.userMessage} createdMessage={item?.createdAt}>
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {messagesArray?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message userMessage={item?.userMessage} createdMessage={item?.createdAt}>
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {isFetching && <div>Loading more messages...</div>}
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


