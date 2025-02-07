import React from "react";
import classes from "./ButtonAttach.module.css";

export default function ButtonAttach({
  image,
  onClick,
  selectArray,
  prefix,
  btnName,
  disabled,
}) {
  return (
    <>
      {disabled ? (
        <div className={classes.btn} disabled={disabled}>
          <img src={image} alt="" />
          <div className={classes.btnItem}>
            {selectArray?.length > 0 ? (
              <span>
                {prefix}
                {Array.isArray(selectArray) ? (
                  selectArray.map((item, index) => (
                    <span key={item.id || index}>
                      {item}
                      {index < selectArray.length - 1 ? ", " : ""}
                    </span>
                  ))
                ) : (
                  <span>{selectArray}</span>
                )}
              </span>
            ) : (
              <span className={classes.btnName}>{btnName}</span>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.btn} onClick={onClick}>
          <img src={image} alt="" />
          <div className={classes.btnItem}>
            {selectArray?.length > 0 ? (
              <span>
                {prefix}
                {Array.isArray(selectArray) ? (
                  selectArray.map((item, index) => (
                    <span key={item.id || index}>
                      {item}
                      {index < selectArray.length - 1 ? ", " : ""}
                    </span>
                  ))
                ) : (
                  <span>{selectArray}</span>
                )}
              </span>
            ) : (
              <span className={classes.btnName}>{btnName}</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
