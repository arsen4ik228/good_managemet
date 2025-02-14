import React, { useEffect } from "react";
import classes from "./HandlerMutation.module.css";
import { message } from "antd";
import icon from "@image/iconHeader.svg";

export default function HandlerMutation({ Loading, Error, Success, textSuccess, textError }) {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (Success) {
      messageApi.success(textSuccess || "Операция выполнена успешно!");
    }
  }, [Success]);

  useEffect(() => {
    if (Error) {
      messageApi.error(textError || "Ошибка! Что-то пошло не так.");
    }
  }, [Error]);

  return (
    <>
      {contextHolder} 

      {Loading && (
        <div className={classes.load}>
          <img src={icon} alt="Loading..." className={classes.loadImage} />
          <div className={classes.wave}>
            {"ЗАГРУЗКА...".split("").map((char, i) => (
              <span key={i} style={{ "--i": i + 1 }}>{char}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
