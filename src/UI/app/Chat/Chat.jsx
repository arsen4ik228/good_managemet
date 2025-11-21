import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import classes from "./Chat.module.css";
import iconHeader from "@image/iconHeader.svg";
import Section from "./section/Section";
import { useNavigate } from "react-router-dom";
import { usePostsHook } from '@hooks'
import { DialogContainer } from '@Custom/DialogContainer/DialogContainer.jsx'
import { useSocket } from "@helpers/SocketContext.js";
import { notEmpty, getPostIdRecipientSocketMessage } from '@helpers/helpers'
import dropdown from '../../image/drop-down.svg';
import search from '../../image/search.svg'
import addIcon from '@image/addCircle.svg'
import { Skeleton } from 'antd';

export default function Chat() {
  const navigate = useNavigate();

  const { allChats, loadingAllChats, refetchAllChats } = usePostsHook()

  const [copyChats, setCopyChats] = useState()
  const [socketMessagesCount, setSocketMessagesCount] = useState(new Map());
  const [isOrganizationsClosed, setOrganizationsClosed] = useState(true);
  const [isSearchClosed, setSearchClosed] = useState(true);
  const [seacrhInput, setSearchInput] = useState('')
  const [selectedContactId, setSelectedContactId] = useState('');

  const eventNames = useMemo(
    () => ["convertCreationEvent", "messageCountEvent"],
    []
  ); // Мемоизация массива событий

  const handleEventData = useCallback((eventName, data) => {
    //(`Data from ${eventName}:`, data);
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
    setSelectedContactId(item.id);
     navigate(`/Chat/${item.id}`); // ВКЛЮЧИТЬ ПРИ ИЗМЕНЕНИИ response jn от сервера
  }

  const filteredItems = useMemo(() => {
    if (!notEmpty(copyChats)) return []

    const filterUsers = copyChats.filter((item) =>
      item.postName.toLowerCase().includes(seacrhInput.toLowerCase()) ||
      item.user?.firstName.toLowerCase().includes(seacrhInput.toLowerCase()) ||
      item.user?.lastName.toLowerCase().includes(seacrhInput.toLowerCase())
    );
    return [
      ...filterUsers
    ]
  }, [copyChats, seacrhInput]);

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

  useLayoutEffect(() => {
    if (!notEmpty(allChats)) return

    setCopyChats([...allChats])
  }, [allChats])


  console.warn(loadingAllChats)
  return (

    <div className={classes.main}>
      <button
        className={classes.btnPomoshnik}
        onClick={handleStartButtonClick}
      >
        <img src={iconHeader} alt="iconHeader" />
        <span>Личный помощник</span>
      </button>
      <button
        className={classes.btnPomoshnik}
        onClick={() => navigate('/new/helper')}
      >
        <img src={iconHeader} alt="iconHeader" />
        <span>Новый интерфейс</span>
      </button>
      <div className={classes.orgHeader}>
        <div className={classes.orgHeaderName}>организации</div>
        <div className={classes.dropdown}
          onClick={() => setOrganizationsClosed(!isOrganizationsClosed)}
        >
          <img
            src={dropdown}
            alt="dropdown"
            className={`${classes.collapseIcon} ${isOrganizationsClosed ? classes.collapsed : ''
              }`}
          />
        </div>
      </div>
      <Section isOrganizationsClosed={isOrganizationsClosed}></Section>

      <div className={classes.header}>
        <div className={classes.headerName}>контакты</div>
        <div>
          <img className={classes.searchIcon} src={addIcon} alt="add" onClick={handleUserButtonClick} />
          <img className={classes.searchIcon} src={search} alt="search" onClick={() => setSearchClosed(!isSearchClosed)} />
        </div>
      </div>
      {!isSearchClosed && (
        <>

          <div className={classes.search}>
            <input type="search" placeholder="поиск" value={seacrhInput} onChange={(e) => setSearchInput(e.target.value)}></input>
          </div>

          {/* <div className={classes.resultSeacrh}>
            {filteredItems?.map((item, index) => (
              <div onClick={() => handleItemClick(item)}>
                <React.Fragment key={index} >
                  <DialogContainer
                    postName={item?.postName}
                    userName={item?.user?.firstName + ' ' + item?.user?.lastName}
                    avatarUrl={item?.user?.avatar_url}
                  ></DialogContainer>
                </React.Fragment>
              </div>
            ))}
          </div> */}
        </>
      )}

      {/* <button onClick={handleUserButtonClick} className={`${classes.btnAddUser} ${!isSearchClosed ? classes['btnAddUserWithSearch'] : ''}`}>
        <span> Добавить пользователя </span>
      </button> */}
      {(filteredItems.length === 0 && !loadingAllChats) && (
        <div className={classes.errorGetContact}>
          Посты отсутствуют или у вас нет активного поста. Обратитесь к руководителю!
        </div>
      )}
      {!loadingAllChats ? (
        filteredItems.map((item, index) => (
          <div key={index} onClick={() => handleItemClick(item)}>
            <DialogContainer
              postName={item?.postName}
              userName={item?.userFirstName + ' ' + item?.userLastName}
              avatarUrl={item?.user?.avatar_url}
              unseenMessagesCount={calculateUnseenMessages(item, socketMessagesCount)}
              selectedContactId={selectedContactId}
              contactId={item.id}
              postsNames={item.postsNames}
            />
          </div>
        ))
      ) : (
        // Skeleton на время загрузки
        Array.from({ length: 9 }).map((_, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <Skeleton
              active
              avatar
              paragraph={{ rows: 2 }}
              title={false}
              style={{
                height: '70px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center'
              }}
            />
          </div>
        ))
      )}
    </div >
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



const calculateUnseenMessages = (item, socketMessagesCount) => {
  if (!item?.unseenMessagesCount) return null;

  return (
    (+item.unseenMessagesCount || 0) +
    (+item.watcherUnseenCount || 0) +
    (+(socketMessagesCount.get(item.id)) || 0)
  );
};