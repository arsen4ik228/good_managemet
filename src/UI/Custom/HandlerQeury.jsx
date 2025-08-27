import React, { useState, useEffect } from "react";
import classes from "./HandlerQeury.module.css";
import icon from "../image/iconHeader.svg";
import error from "../image/error.svg";

import { Result } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

export default function HandlerQeury({ Loading, Fetching, Error, textError }) {
  const [visibleError, setVisibleError] = useState(false);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    if (Error) {
      setVisibleError(true);
    }
  }, [Error]);

  // Анимация прогресс-бара
  useEffect(() => {
    let interval;
    if (Loading || Fetching) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90; // Останавливаемся на 85% для имитации незавершенной загрузки
          return prev + 4;
        });
      }, 40);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [Loading, Fetching]);

  const handerErrorButtonClick = () => {
    setVisibleError(false);
  };

  return (
    <>
      {(Fetching || Loading) && (
        <div className={classes.load}>
          <div className={classes.loadContent}>
            <img src={icon} alt="Loading..." className={classes.loadImage} />
            <div className={classes.progressContainer}>
              <div
                className={classes.progressBar}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {visibleError && (
        <div
          style={{
            maxWidth: "400px",
            position: "fixed",
            top: "15%",
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 10000,
            backgroundColor: "white",
            border: "1px solid #d9d9d9",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CloseCircleOutlined
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "18px",
              color: "#ff4d4f",
              cursor: "pointer",
            }}
            onClick={handerErrorButtonClick}
          />
          <Result
            status="error"
            title="Ошибка выполнения"
            subTitle={textError}
            icon={
              <CloseCircleOutlined
                style={{ transform: "scale(2.5)", color: "#ff4d4f" }}
              />
            }
          />
        </div>
      )}
    </>
  );
}