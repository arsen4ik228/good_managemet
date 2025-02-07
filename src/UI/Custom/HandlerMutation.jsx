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


  const handerErrorButtonClick = () => {
    setVisibleError(false);
    setVisibleTextError("");
  };

  useEffect(() => {
    setShowSuccessMutation(Success);
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
          <img src={icon} alt="Loading..." className={classes.loadImage} />
          <div className={classes.wave}>
            <span style={{ "--i": 1 }}>З</span>
            <span style={{ "--i": 2 }}>А</span>
            <span style={{ "--i": 3 }}>Г</span>
            <span style={{ "--i": 4 }}>Р</span>
            <span style={{ "--i": 5 }}>У</span>
            <span style={{ "--i": 6 }}>З</span>
            <span style={{ "--i": 7 }}>К</span>
            <span style={{ "--i": 8 }}>А</span>
            <span style={{ "--i": 9 }}>.</span>
            <span style={{ "--i": 10 }}>.</span>
            <span style={{ "--i": 11 }}>.</span>
          </div>
        </div>
      )}

      {visibleError && (
        <div
          style={{
            position: "fixed",
            top: "5%",
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
        <Result
          style={{
            position: "fixed",
            top: "5%",
            zIndex: 10000,
            backgroundColor: "white",
            border: "1px solid #d9d9d9",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
          status="success"
          title="Успешно выполнено!"
          subTitle={textSuccess}
          icon={
            <CheckCircleOutlined
              style={{ transform: "scale(2.5)", color: "#52c41a" }}
            />
          }
        />
      )}
    </>
  );
}
