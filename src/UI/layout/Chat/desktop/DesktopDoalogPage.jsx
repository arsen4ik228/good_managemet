import React, { useLayoutEffect, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import classes from './DesktopDialogPage.module.css';
import Headers from "@Custom/Headers/Headers";
import { useConvertsHook, useMessages, useUnseenMessages, useRightPanel, useGetUserId } from '@hooks';
import { useParams } from 'react-router-dom';
import { Message } from '@Custom/Message/Message';
import Input from '../Input';
import { notEmpty } from '@helpers/helpers'
import { debounce } from 'lodash';
import { useSocket, useEmitSocket } from '@helpers/SocketContext';
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import MainContentContainer from '../../../Custom/MainContentContainer/MainContentContainer';
import ChatContainer from '../ChatContainer/ChatContainer';
import FinalConvertModal from '@Custom/FinalConvertModal/FinalConvertModal'
import ApproveConvertModal from '../../../Custom/FinalConvertModal/ApproveConvertModal';
import { convertApi, postApi } from '../../../../store/services';
import { useDispatch } from 'react-redux';
import { baseUrl } from '../../../../helpers/constants';
import default_avatar from '@image/default_avatar.svg'




export default function DesktopDialogPage() {
    const { convertId, contactId } = useParams();
    const dispatch = useDispatch()
    const [paginationSeenMessages, setPaginationSeenMessages] = useState(0);
    const [paginationUnSeenMessages, setPaginationUnSeenMessages] = useState(0);
    const [openFinishModal, setOpenFinishModal] = useState()
    const [openAgreementModal, setOpenAgreementModal] = useState()
    const bodyRef = useRef(null);
    const [messagesArray, setMessagesArray] = useState();
    const [socketMessages, setSocketMessages] = useState([]);
    const unSeenMessagesRef = useRef(null);
    const [visibleUnSeenMessageIds, setVisibleUnSeenMessageIds] = useState([]);
    const historySeenIds = []
    const [buttons, setButtons] = useState()

    const {
        currentConvert,
        senderPostId,
        userInfo,
        senderPostName,
        senderPostForSocket,
        sendMessage,
        refetchGetConvertId,
        isLoadingGetConvertId,
        isFetchingGetConvartId,
        isErrorGetConvertId,
        pathOfUsers,

        contactInfo
    } = useConvertsHook({ convertId: convertId, contactId: contactId });

    const {
        updatePanelProps
    } = useRightPanel()

    const {
        seenMessages,
        unSeenMessageExist,
        isLoadingSeenMessages,
        isErrorSeenMessages,
        isFetchingSeenMessages,
        // unSeenMessages,
        unSeenMessagesIds,

    } = useMessages(convertId, paginationSeenMessages);

    const {
        unSeenMessages,
        isLoadingUnSeenMessages,
        isErrorUnSeenMessages,
        isFetchingUnSeenMessages,
    } = useUnseenMessages(convertId)

    const { reduxUserId } = useGetUserId()

    const seenMessagesRef = useRef(seenMessages);
    const unSeenMessageExistRef = useRef(unSeenMessageExist)

    useEmitSocket('join_convert', { convertId: convertId });
    useEmitSocket('messagesSeen', { convertId: convertId, messageIds: visibleUnSeenMessageIds, post: senderPostForSocket })

    // Инициализация socket подписок 
    const eventNames = useMemo(() => ['messageCreationEvent', 'messagesAreSeen'], []);
    const handleEventData = useCallback((eventName, data) => {
        console.log(`Data from ${eventName}:`, data);
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
        console.log(newMessage)
        setSocketMessages(prev => [...prev, {
            id: newMessage.id,
            content: newMessage.content,
            sender: newMessage.sender,
            attachmentToMessages: newMessage.attachmentToMessages,
            timeSeen: null,
            createdAt: newMessage.createdAt,
        }]);

        dispatch(convertApi.util.invalidateTags([{ type: 'Convert', id: convertId }]));
        dispatch(postApi.util.invalidateTags([{ type: 'Chats', id: userInfo?.userId }]));
    }, [socketResponse?.messageCreationEvent]);

    // Прочтение сообщений(смена статуса)
    useEffect(() => {
        // Проверяем, что socketResponse.messagesAreSeen и messageIds существуют
        if (!socketResponse?.messagesAreSeen || !Array.isArray(socketResponse.messagesAreSeen.messageIds)) {
            return;
        }

        // Функция для обновления сообщений
        const updateMessages = (messages) => {
            return messages.map(message => {
                console.log(socketResponse.messagesAreSeen.messageIds)
                if (socketResponse.messagesAreSeen.messageIds.includes(message.id)) {
                    console.log('bam')
                    return {
                        ...message,
                        seenStatuses: ['isSeen']  // socketResponse.messagesAreSeen.dateSeen,
                    };
                }
                return message;
            });
        };

        // Обновляем messagesArray, если есть непрочитанные сообщения
        if (unSeenMessageExistRef.current) {
            const updatedMessagesArray = updateMessages(unSeenMessages);
            const hasUnSeenMessages = updatedMessagesArray.some(message =>
                socketResponse.messagesAreSeen.messageIds.includes(message.id)
            );

            if (hasUnSeenMessages) {
                setMessagesArray(updatedMessagesArray);
            } else {
                unSeenMessageExistRef.current = false;
            }
        }

        dispatch(convertApi.util.invalidateTags([{ type: 'Convert', id: convertId }]));
        dispatch(postApi.util.invalidateTags([{ type: 'Chats', id: userInfo?.userId }]));

        // Обновляем socketMessages
        const updatedSocketMessages = updateMessages(socketMessages);
        setSocketMessages(updatedSocketMessages);
    }, [socketResponse?.messagesAreSeen, unSeenMessageExist]);

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

    useEffect(() => {
        if (!convertId) return;

        setSocketMessages([])
        setMessagesArray()

    }, [convertId])

    useEffect(() => {
        if (!contactInfo) return
        console.warn('set props desktopDoalog ', contactInfo)
        updatePanelProps({
            name: contactInfo.userName,
            postsNames: contactInfo?.postsNames.join(', '),
            avatar: contactInfo.avatar ? baseUrl + contactInfo.avatar : default_avatar
        })

    }, [contactInfo])

    useEffect(() => {
        if (!notEmpty(currentConvert)) return

        const tempArray = []

        if (currentConvert?.host.user.id === reduxUserId)
            tempArray.push({ click: () => setOpenFinishModal(true), text: 'завершить' })

        if (currentConvert?.convertPath === 'Согласование')
            tempArray.push({ click: () => setOpenAgreementModal(true), text: 'согласовать' })

        setButtons(tempArray)

    }, [currentConvert])

    console.log(socketMessages)

    return (
        <MainContentContainer buttons={buttons}>
            {/* <div className={classes.dialog}>
                <Headers name={userInfo?.userName} sectionName={userInfo.postName} avatar={userInfo?.avatar}>
                </Headers> */}
            <ChatContainer>
                {/* <div className={classes.main}> */}
                <div className={classes.body} ref={bodyRef}>
                    {socketMessages?.slice()?.reverse()?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message
                                userMessage={item?.sender.user.id === reduxUserId}
                                createdMessage={item?.createdAt}
                                seenStatuses={item?.seenStatuses}
                                attachmentToMessage={item?.attachmentToMessages}
                                avatar={item?.sender.user.avatar_url}
                                {...(item?.sender.user.id !== reduxUserId && { 'data-message-id': item.id })}
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
                                        userMessage={item?.sender.user.id === reduxUserId}
                                        createdMessage={item?.createdAt}
                                        ref={index === unSeenMessages.length - 1 ? unSeenMessagesRef : null}
                                        data-message-id={item.id} // Добавляем data-атрибут
                                        attachmentToMessage={item?.attachmentToMessages}
                                        seenStatuses={item?.seenStatuses}
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
                                userMessage={item?.sender.user.id === reduxUserId}
                                seenStatuses={item?.seenStatuses}
                                senderPost={item?.sender}
                                attachmentToMessage={item?.attachmentToMessages}
                                createdMessage={item?.createdAt}
                                avatar={item?.sender.user.avatar_url}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}
                    {isFetchingSeenMessages && <div>Loading more messages...</div>}
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
    );
};