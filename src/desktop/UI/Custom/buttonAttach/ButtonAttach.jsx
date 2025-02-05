import React from "react";
import classes from "./ButtonAttach.module.css";

export default function ButtonAttach({
  image,
  onClick,
  selectArray,
  prefix,
  btnName,
}) {
  return (
    <div className={classes.btn} onClick={onClick}>
      <img src={image} alt="" />
      <div className={classes.btnItem}>
        {selectArray?.length > 0 ? (
          <span>
            {prefix}
            {selectArray?.map((item, index) => (
              <span key={item.id}>
                {item}
                {index < selectArray?.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        ) : (
          <span className={classes.btnName}>{btnName}</span>
        )}
      </div>
    </div>
  );
}
