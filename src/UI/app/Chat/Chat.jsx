import React, { useCallback, useEffect, useMemo, useState } from "react";
import classes from "./Chat.module.css";
import iconHeader from "@image/iconHeader.svg";
import burger from "@image/burger.svg";
import Section from "./section/Section";
import { useNavigate } from "react-router-dom";
import { usePostsHook } from '@hooks'
import { DialogContainer } from '@Custom/DialogContainer/DialogContainer.jsx'
import { useSocket } from "@helpers/SocketContext.js";
import { notEmpty, getPostIdRecipientSocketMessage } from '@helpers/helpers'
import { FloatButton } from "antd";
import arrowBack from "@image/back_white.svg";

export default function Chat() {
  const navigate = useNavigate();

  const { allChats, refetchAllChats } = usePostsHook()

  const [copyChats, setCopyChats] = useState()
  const [socketMessagesCount, setSocketMessagesCount] = useState(new Map());

  const eventNames = useMemo(
    () => ["convertCreationEvent", "messageCountEvent"],
    []
  ); // Мемоизация массива событий

  const handleEventData = useCallback((eventName, data) => {
    console.log(`Data from ${eventName}:`, data);
  }, []); // Мемоизация callbac

  const socketResponse = useSocket(eventNames, handleEventData);

  const handleUserButtonClick = () => {
    navigate("/user");
  };
  const handleStartButtonClick = () => {
    navigate("/pomoshnik/start");
  };

  const handleItemClick = (item) => {
    //dispatch(setSelectedItem(item));

    navigate(`/Chat/${item.id}`)
  }

  useEffect(() => {
    if (!notEmpty(socketResponse?.convertCreationEvent)) return

    refetchAllChats()
  }, [socketResponse?.convertCreationEvent])

  useEffect(() => {
    if (!notEmpty(socketResponse?.messageCountEvent)) return

    const response = socketResponse.messageCountEvent
    const recepientId = getPostIdRecipientSocketMessage(response.host, response.lastPostInConvert);
    const newMap = new Map(socketMessagesCount);

    if (newMap.has(recepientId.toString())) {
      newMap.set(recepientId.toString(), newMap.get(recepientId.toString()) + 1);
    }
    else {
      newMap.set(recepientId.toString(), 1);
    }

    setCopyChats(getChatsWithTimeOfSocketMessage(copyChats, recepientId))
    setSocketMessagesCount(newMap);
  }, [socketResponse?.messageCountEvent])

  useEffect(() => {
    if (!notEmpty(allChats)) return

    setCopyChats([...allChats])
  }, [allChats])

  return (
    <div className={classes.contact}>
      <div className={classes.header}>
        <div className={classes.headerName}>контакты</div>
        <img src={burger} alt="burger" />
      </div>
      <div className={classes.search}>
        <input type="search" placeholder="поиск"></input>
      </div>
      <div className={classes.main}>
        <button
          className={classes.btnPomoshnik}
          onClick={handleStartButtonClick}
        >
          <img src={iconHeader} alt="iconHeader" />
          <span>Личный помощник</span>
        </button>
        <Section></Section>

        <div>

          {copyChats?.map((item, index) => (
            <div onClick={() => handleItemClick(item)}>
              <React.Fragment key={index} >
                <DialogContainer
                  postName={item?.postName}
                  userName={item?.userFirstName + ' ' + item?.userLastName}
                  avatarUrl={item?.userAvatar}
                  unseenMessagesCount={
                    (+item?.unseenMessagesCount) +
                    (+item?.watcherUnseenCount) +
                    (+socketMessagesCount.get(item?.id) || 0)
                  }
                ></DialogContainer>
              </React.Fragment>
            </div>
          ))}
        </div>

        <button onClick={handleUserButtonClick} className={classes.btnAddUser}>
          <span> Добавить пользователя </span>
        </button>

        {/* <FloatButton
          icon={
            <img src={arrowBack} alt="back" style={{ width: 20, height: 20 }} />
          }
          type="primary"
          tooltip="Добавить пользователя"
          onClick={handleUserButtonClick}
          style={{
            insetInlineStart: 380,
          }}
        /> */}
      </div>
    </div>
  );
}

const getChatsWithTimeOfSocketMessage = (chatsArray, id) => {
  if (!chatsArray) return [];

  // 1. Приводим ВСЕ даты к типу Date (чтобы сравнивать одинаковые типы)
  const normalizedChats = chatsArray.map(chat => ({
    ...chat,
    latestMessageCreatedAt: new Date(chat.latestMessageCreatedAt)
  }));

  // 2. Обновляем дату в нужном чате
  const updatedChats = normalizedChats.map(chat =>
    chat.id === id
      ? { ...chat, latestMessageCreatedAt: new Date() }
      : chat
  );

  // 3. Сортируем (теперь все latestMessageCreatedAt — объекты Date)
  const sortedChats = [...updatedChats].sort((a, b) =>
    b.latestMessageCreatedAt - a.latestMessageCreatedAt
  );
  console.warn(sortedChats)
  return sortedChats;
};
