import React, { useLayoutEffect, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import classes from './AgreementDialogPage.module.css';
import Header from "@Custom/CustomHeader/Header";
import { useConvertsHook, useMessages } from '@hooks';
import { useParams } from 'react-router-dom';
import { Message } from '@Custom/Message/Message';
import { notEmpty } from '@helpers/helpers'
import { debounce } from 'lodash';
import { useSocket, useEmitSocket } from '@helpers/SocketContext';
import Input from '../Input';
import ConvertTargetContainer from '@Custom/ConvertTargetContainer/ConvertTargetContainer';
import AdaptiveLayoutContainer from '../adaptive.container/AdaptiveLayoutContainer';
import ApproveConvert from '../../../Custom/ApproveConvert/ApproveConvert';

// Страница диалога для конверта на согласовании.
// Отображает чат между участниками, шапку с информацией о конверте
// и кнопки утверждения/отклонения.
export default function AgreementDialogPage() {
    // ID конверта из URL (например: /agreement/:convertId)
    const { convertId } = useParams();

    // Смещение для пагинации прочитанных сообщений: +30 при каждом скроле вверх
    const [paginationSeenMessages, setPaginationSeenMessages] = useState(0);
    // Смещение для пагинации непрочитанных (зарезервировано, пока не используется)
    const [paginationUnSeenMessages, setPaginationUnSeenMessages] = useState(0);

    // Ref на прокручиваемый контейнер сообщений
    const bodyRef = useRef(null);

    // Накопленный массив прочитанных сообщений из всех загруженных страниц
    const [messagesArray, setMessagesArray] = useState();

    // Сообщения, пришедшие через WebSocket в реальном времени (не из БД)
    const [socketMessages, setSocketMessages] = useState([]);

    // Ref на первый элемент блока непрочитанных — для прокрутки к нему при загрузке
    const unSeenMessagesRef = useRef(null);

    // ID непрочитанных сообщений, которые сейчас видны на экране (для отправки события "прочитано")
    const [visibleUnSeenMessageIds, setVisibleUnSeenMessageIds] = useState([]);

    // Изменение статуса конверта (утвердить / отклонить), пробрасывается в Input
    const [convertStatusChange, setConvertStatusChange] = useState()

    // Список ID сообщений, которые уже были помечены как прочитанные в текущей сессии.
    // Хранится вне состояния, чтобы не вызывать лишних ре-рендеров.
    const historySeenIds = []

    // Данные и методы для работы с конвертом:
    // currentConvert — объект конверта, senderPostId — ID должности текущего пользователя,
    // sendMessage — отправка сообщения, approveConvert/finishConvert — смена статуса конверта
    const {
        currentConvert,
        senderPostId,
        userInfo,
        senderPostName,
        senderPostForSocket,
        sendMessage,
        recipientPost,
        refetchGetConvertId,
        approveConvert,
        finishConvert,
        isLoadingGetConvertId
    } = useConvertsHook({ convertId });

    // Загрузка сообщений с пагинацией:
    // seenMessages — прочитанные (страница по paginationSeenMessages),
    // unSeenMessages — непрочитанные (загружаются отдельно)
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

    // Ref-копии для использования внутри колбэков без добавления в deps
    const seenMessagesRef = useRef(seenMessages);
    const unSeenMessageExistRef = useRef(unSeenMessageExist)

    // При монтировании входим в комнату конверта по WebSocket
    useEmitSocket('join_convert', { convertId: convertId });
    // Отправляем серверу ID сообщений, которые пользователь увидел
    useEmitSocket('messagesSeen', { convertId: convertId, messageIds: visibleUnSeenMessageIds, post: senderPostForSocket })

    // Подписка на входящие WebSocket-события:
    // messageCreationEvent — новое сообщение от другого участника
    // messagesAreSeen — кто-то прочитал сообщения
    const eventNames = useMemo(() => ['messageCreationEvent', 'messagesAreSeen'], []);
    const handleEventData = useCallback((eventName, data) => {
        //(`Data from ${eventName}:`, data);
    }, []);
    const socketResponse = useSocket(eventNames, handleEventData);

    // Инфинити-скрол вверх: при достижении верха контейнера запрашиваем следующую страницу прочитанных
    const handleScroll = debounce(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        const { scrollTop, scrollHeight, clientHeight } = bodyElement;
        if (Math.abs(scrollTop) >= scrollHeight - clientHeight - 200 && !isFetchingSeenMessages && notEmpty(seenMessagesRef.current))
            setPaginationSeenMessages((prev) => prev + 30);
    }, 200);

    // Вешаем и снимаем слушатель скрола на контейнер сообщений
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

    // При каждой новой странице прочитанных — добавляем их в конец messagesArray
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

    // Новое сообщение пришло через сокет — добавляем в socketMessages
    useEffect(() => {
        if (!notEmpty(socketResponse?.messageCreationEvent)) return;

        const newMessage = socketResponse.messageCreationEvent
        setSocketMessages(prev => [...prev, {
            id: newMessage.id,
            content: newMessage.content,
            // Определяем, наше ли это сообщение, чтобы выровнять его по правому краю
            userMessage: newMessage.sender.id === senderPostId,
            attachmentToMessage: newMessage.attachmentToMessage,
            timeSeen: null,
            createdAt: newMessage.createdAt,
        }]);
    }, [socketResponse?.messageCreationEvent]);

    // Кто-то прочитал сообщения — обновляем статус seenStatuses у нужных элементов
    useEffect(() => {
        if (!socketResponse?.messagesAreSeen || !Array.isArray(socketResponse.messagesAreSeen.messageIds)) {
            return;
        }

        const updateMessages = (messages) => {
            return messages.map(message => {
                if (socketResponse.messagesAreSeen.messageIds.includes(message.id)) {
                    return {
                        ...message,
                        seenStatuses: ['isSeen'],
                    };
                }
                return message;
            });
        };

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

        const updatedSocketMessages = updateMessages(socketMessages);
        setSocketMessages(updatedSocketMessages);
    }, [socketResponse?.messagesAreSeen, unSeenMessageExist]);

    // После загрузки непрочитанных — прокручиваем к первому из них
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

    // IntersectionObserver следит, какие непрочитанные сообщения видны на экране.
    // Их ID собираются в visibleUnSeenMessageIds и отправляются серверу через useEmitSocket выше.
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleIds = [];

                entries.forEach((entry) => {
                    const messageId = entry.target.dataset.messageId;
                    if (entry.isIntersecting && !historySeenIds.includes(messageId)) {
                        visibleIds.push(messageId);
                        // Запоминаем, чтобы не отправлять повторно в этой сессии
                        historySeenIds.push(messageId);
                    }
                });

                setVisibleUnSeenMessageIds(visibleIds);
            },
            {
                root: bodyRef.current,
                threshold: 0.4, // Сообщение считается прочитанным при 40% видимости
            }
        );

        // Подписываемся на все элементы с data-message-id (непрочитанные)
        const messageElements = bodyRef.current.querySelectorAll('[data-message-id]');
        messageElements.forEach((element) => observer.observe(element));

        return () => {
            messageElements.forEach((element) => observer.unobserve(element));
            observer.disconnect();
        };
    }, [unSeenMessages, socketMessages]);


    return (
        <>
            {/* Адаптивная обёртка: переключает layout между мобильным и десктопом */}
            <AdaptiveLayoutContainer
                userInfo={userInfo}
            >
                {/* Шапка с информацией о конверте (статус цели, текст, дата) и кнопками согласования */}
                <ConvertTargetContainer
                    targetStatus={currentConvert?.target?.targetStatus}
                    targetText={currentConvert?.target?.content}
                    date={currentConvert?.target?.createdAt}
                    isWatcher={true}
                >
                    {/* Кнопки "Утвердить" / "Отклонить" конверт */}
                    <ApproveConvert
                        setRequestFunction={setConvertStatusChange}
                    ></ApproveConvert>
                </ConvertTargetContainer>

                {/* Прокручиваемая область сообщений */}
                <div className={classes.body} ref={bodyRef}>

                    {/* 1. Реалтайм-сообщения из WebSocket (самые новые, сверху) */}
                    {socketMessages?.slice().reverse().map((item, index) => (
                        <React.Fragment key={index}>
                            <Message
                                userMessage={item?.sender?.id === senderPostId}
                                createdMessage={item?.createdAt}
                                seenStatuses={item?.seenStatuses}
                                data-message-number={item.messageNumber}
                                attachmentToMessage={item?.attachmentToMessages}
                                senderPostName={item?.senderPostName}
                                {/* data-message-id вешается только на чужие сообщения для IntersectionObserver */}
                                {...(!item.userMessage && { 'data-message-id': item.id })}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}

                    {/* 2. Непрочитанные сообщения из БД + разделитель */}
                    {unSeenMessages?.length > 0 && (
                        <>
                            {unSeenMessages?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Message
                                        userMessage={item?.sender?.id === senderPostId}
                                        createdMessage={item?.createdAt}
                                        {/* Ref на последний элемент блока — для прокрутки к нему */}
                                        ref={index === unSeenMessages.length - 1 ? unSeenMessagesRef : null}
                                        data-message-id={item.id}
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

                    {/* 3. Прочитанные сообщения из БД (старые, подгружаются при скроле вверх) */}
                    {messagesArray?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message key={index}
                                userMessage={item?.sender?.id === senderPostId}
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

                {/* Поле ввода сообщения и кнопки действий с конвертом */}
                <footer className={classes.footer}>
                    <Input
                        convertId={currentConvert?.id}
                        sendMessage={sendMessage}
                        convertStatusChange={convertStatusChange}
                        senderPostId={senderPostId}
                        senderPostName={senderPostName}
                        approveConvert={approveConvert}
                        finishConvert={finishConvert}
                        refetchMessages={refetchGetConvertId}
                        isLoadingGetConvertId={isLoadingGetConvertId}
                    />
                </footer>
            </AdaptiveLayoutContainer>
        </>
    );
};
