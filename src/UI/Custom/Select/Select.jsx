import React from "react";
import classes from "./Select.module.css";

export default function Select({
  name,
  value,
  onChange,
  array,
  arrayItem,
  arrayItemTwo,
  disabledPole
}) {
  return (
    <div className={classes.item}>
      <div className={classes.itemName}>
        <span>
          {name} <span style={{ color: "red" }}>*</span>
        </span>
      </div>
      <div className={classes.div}>
        <select
          name="mySelect"
          className={classes.select}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          disabled={disabledPole}
        >

          {array?.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item[arrayItem]} {arrayItemTwo && item[arrayItemTwo]}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
