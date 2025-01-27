import React, { useState, useEffect } from "react";
import classes from "./HandlerMutation.module.css";
import icon from "../image/iconHeader.svg";
import error from "../image/error.svg";
import success from "../image/success.svg";
export default function HandlerMutation({
  Loading,
  Error,
  Success,
  textSuccess,
  textError,
}) {
  const [showSuccessMutation, setShowSuccessMutation] = useState(false);
  const [showErrorMutation, setShowErrorMutation] = useState(false);

  useEffect(() => {
    setShowSuccessMutation(Success);
  }, [Success]);

  useEffect(() => {
    setShowErrorMutation(Error);
  }, [Error]);

  return (
    <>
      {Loading && (
        <div className={classes.load}>
          <img src={icon} alt="Loading..." className={classes.loadImage} />
          <div className={classes.wave}>
            {/* <span className={classes.spanLoad}>Загрузка...</span> */}
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

      {showErrorMutation && (
        <div className={classes.error}>
          <img src={error} alt="Error" className={classes.errorImage} />
          <span className={classes.spanError}>{textError}</span>
        </div>
      )}

      {showSuccessMutation && (
        <div className={classes.success}>
          <img src={success} alt="success" className={classes.successImage} />
          <span className={classes.spanSuccess}>{textSuccess}</span>
        </div>
      )}
    </>
  );
}
