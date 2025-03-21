import React, { useCallback, useEffect, useMemo, useState } from "react";
import classes from "./Chat.module.css";
import iconHeader from "@image/iconHeader.svg";
import burger from "@image/burger.svg";
import Section from "./section/Section";
import { useNavigate } from "react-router-dom";
import { usePostsHook } from '@hooks'
import { DialogContainer } from '@Custom/DialogContainer/DialogContainer.jsx'
import { useSocket } from "@helpers/SocketContext.js"; // Импортируем useSocket
import { FloatButton } from "antd";
import arrowBack from "@image/back_white.svg";

export default function Chat() {
  const navigate = useNavigate();

const { allChats, refetchAllChats } = usePostsHook()


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

          {allChats?.map((item, index) => (
            <div
            onClick={() => navigate(`/Chat/${item.id}`)}
            >
              <React.Fragment key={index} >
                <DialogContainer elem={item}></DialogContainer>
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
