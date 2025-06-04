import React from "react";
import classes from "./ButtonAttach.module.css";

export default function ButtonAttach({
  image,
  onClick,
  selectArray,
  prefix,
  btnName,
  disabled,
  widthBtn,
  dataTour
}) {
  const btnClass = widthBtn === "190px" ? classes.btnWidth190 : classes.btnWidth250;

  return (
    <>
      {disabled ? (
        <div className={`${btnClass} ${classes.btn}`} disabled={disabled} data-tour={dataTour}>
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
        <div className={`${btnClass} ${classes.btn}`} onClick={onClick} data-tour={dataTour}>
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
