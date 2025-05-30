import React, { useState } from "react";
import classes from "./Input.module.css";
import { Form, Input as InputAnt, Search } from "antd";

export default function Input({
  refInput,
  children,
  name,
  value,
  onChange,
  disabledPole,
  isShowInput,
}) {
  return (
    <div className={classes.item} ref={refInput}>
      <div className={classes.itemName}>
        <span>
          {name} <span style={{ color: "red" }}>*</span>
        </span>
      </div>
      <div className={classes.div}>
        {!isShowInput && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            title={name}
            className={classes.select}
            disabled={disabledPole}
          ></input>
        )}
        {children}
      </div>
    </div>
  );
}
