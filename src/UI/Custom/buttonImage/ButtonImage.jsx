import React from "react";
import classes from "./ButtonImage.module.css";
import { Tooltip } from "antd";

export default function ButtonImage({ name, icon, onClick, refAction, dataTour }) {
  return (
    <Tooltip placement="bottom" title={name}>
      <img
        data-tour={dataTour}
        ref={refAction}
        src={icon}
        alt="icon"
        className={classes.icon}
        onClick={() => onClick()}
      />
    </Tooltip>
  );
}
