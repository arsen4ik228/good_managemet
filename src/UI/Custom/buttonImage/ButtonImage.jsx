import React from "react";
import classes from "./ButtonImage.module.css";

export default function ButtonImage({name, icon, onClick}) {
  return (
    <div className={classes.wrapper} data-name={name}>
      <img
        src={icon}
        alt="icon"
        className={classes.icon}
        onClick={() => onClick()}
      />
    </div>
  );
}
