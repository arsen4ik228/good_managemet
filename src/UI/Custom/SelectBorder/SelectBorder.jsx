import React from "react";
import classes from "./SelectBorder.module.css";

export default function SelectBorder({
  value,
  onChange,
  array,
  array1,
  arrayItem,
  prefix,
  styleSelected
}) {

  return (
    <div className={classes.item}>
      <select
        name="mySelect"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className={`${classes.select} ${classes[styleSelected]}`}
      >
        <option value="" disabled>
          Выберите стратегию
        </option>

        {array?.map((item) => (
          <>
            <option key={item.id} value={item.id} className={classes[item.state]}>
              {prefix}
              {item[arrayItem]}
            </option>
          </>
        ))}

        {array1?.map((item) => {
          return (
            <option key={item.id} value={item.id} className={classes[item.state]}>
              {prefix}
              {item[arrayItem]}
            </option>
          );
        })}
      </select>
    </div>
  );
}
