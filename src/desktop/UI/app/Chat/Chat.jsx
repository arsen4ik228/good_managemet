import React from "react";
import classes from "./Chat.module.css";
import iconHeader from "@image/iconHeader.svg";
import burger from "@image/burger.svg";
import Section from "./section/Section";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    navigate("/pomoshnik/user");
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
        <div className={classes.item}>
          <img src={iconHeader} alt="iconHeader" />
          <span>Личный помощник</span>
        </div>
        <Section></Section>
        <button onClick={handleButtonClick} className={classes.btnAddUser}> Добавить пользователя </button>
      </div>
    </div>
  );
}
