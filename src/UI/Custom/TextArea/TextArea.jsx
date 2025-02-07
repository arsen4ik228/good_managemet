import React from "react";
import classes from "./TextArea.module.css";

export default function TextArea({ value, onChange, readOnly }) {
  return (
    <textarea
      className={`${classes.textArea} ${readOnly ? classes.textColor : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={readOnly}
    ></textarea>
  );
}
