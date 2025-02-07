import React from "react";
import classes from "./ModalWindow.module.css";
import exit from "../image/exitModal.svg";

export default function ModalWindow({ text, close, btnYes, btnNo, exitBtn }) {
  return (
    <div className={classes.modalDelete}>
      <div className={classes.modalDeleteElement}>
        <img
          src={exit}
          alt="exit"
          className={classes.exitImage}
          onClick={() => close(false)}
        />
        <div className={classes.modalRow1}>
          <span className={classes.text}>{text}</span>
        </div>
        {!exitBtn && (
          <div className={classes.modalRow2}>
            <button
              className={`${classes.btnYes} ${classes.textBtnYes}`}
              onClick={btnYes}
            >
              Да
            </button>
            <button
              className={`${classes.btnNo} ${classes.textBtnNo}`}
              onClick={btnNo}
            >
              Нет
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
