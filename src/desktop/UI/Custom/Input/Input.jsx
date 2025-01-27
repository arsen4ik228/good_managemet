import React from "react";
import classes from "./Input.module.css";
export default function Input({
  children,
  name,
  value,
  onChange,
  disabledPole,
}) {
  return (
    <div className={classes.item}>
      <div className={classes.itemName}>
        <span>
          {name} <span style={{ color: "red" }}>*</span>
        </span>
      </div>
      <div className={classes.div}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          title={name}
          className={classes.select}
          disabled={disabledPole}
        ></input>
        {children}
      </div>
    </div>
  );
}
