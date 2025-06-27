import React, { useState, useEffect } from "react";
import classes from "./HandlerQeury.module.css";
import icon from "../image/iconHeader.svg";
import error from "../image/error.svg";

import { Result } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

export default function HandlerQeury({ Loading, Fetching, Error }) {
  const [visibleError, setVisibleError] = useState(false);

  useEffect(() => {
    if (Error) {
      setVisibleError(true);
    }
  }, [Error]);

  const handerErrorButtonClick = () => {
    setVisibleError(false);
  };

  return (
    <>
      {(Fetching || Loading) && (
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
            maxWidth:"400px",
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
            subTitle={
              "Не выбрана организация!"
            }
            icon={
              <CloseCircleOutlined
                style={{ transform: "scale(2.5)", color: "#ff4d4f" }}
              />
            }
          />
        </div>
      )}

      {/* {Error && (
        <div className={classes.error}>
          <img src={error} alt="Error" className={classes.errorImage} />
          <span className={classes.spanError}>Ошибка</span>
        </div>
      )} */}
    </>
  );
}
