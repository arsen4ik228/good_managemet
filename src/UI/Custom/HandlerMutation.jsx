import React, { useState, useEffect } from "react";
import classes from "./HandlerMutation.module.css";

import { Result } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import icon from "../image/iconHeader.svg";

export default function HandlerMutation({
  Loading,
  Error,
  Success,
  textSuccess,
  textError,
}) {
  const [showSuccessMutation, setShowSuccessMutation] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [visibleTextError, setVisibleTextError] = useState("");
  const [progress, setProgress] = useState(5);

  const handerErrorButtonClick = () => {
    setVisibleError(false);
    setVisibleTextError("");
  };

  // Анимация прогресс-бара
  useEffect(() => {
    let interval;
    if (Loading) {
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
  }, [Loading]);

  useEffect(() => {
    setShowSuccessMutation(Success);
    setTimeout(() => (setShowSuccessMutation(false)), 1500)
  }, [Success]);

  useEffect(() => {
    if (Error) {
      setVisibleError(true);
      setVisibleTextError(textError);
    }
  }, [Error]);

  return (
    <>
      {Loading && (
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
        <div className={classes.errorContainer}>
          <CloseCircleOutlined
            className={classes.closeErrorIcon}
            onClick={handerErrorButtonClick}
          />
          <Result
            status="error"
            title="Ошибка выполнения"
            subTitle={visibleTextError}
            icon={
              <CloseCircleOutlined
                style={{ transform: "scale(2.5)", color: "#ff4d4f" }}
              />
            }
          />
        </div>
      )}

      {showSuccessMutation && (
        <div className={classes.successContainer}>
          <Result
            status="success"
            title="Успешно выполнено!"
            subTitle={textSuccess}
            icon={
              <CheckCircleOutlined
                style={{ transform: "scale(2.5)", color: "#52c41a" }}
              />
            }
          />
        </div>
      )}
    </>
  );
}