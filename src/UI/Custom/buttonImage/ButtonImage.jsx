import React from "react";
import classes from "./ButtonImage.module.css";
import { Tooltip } from 'antd';

export default function ButtonImage({ name, icon, onClick }) {
  return (
    <Tooltip placement="bottom" title={name}>
      <img
        src={icon}
        alt="icon"
        className={classes.icon}
        onClick={() => onClick()}
      />
    </Tooltip>

    // <div className={classes.wrapper} data-name={name}>
    //   <img
    //     src={icon}
    //     alt="icon"
    //     className={classes.icon}
    //     onClick={() => onClick()}
    //   />
    // </div>
  );
}
