import React from "react";
import classes from "./WaveLetters.module.css";
export default function WaveLetters({ letters }) {
  const arrayLetters = letters.split("");
  return (
    <div className={classes.wave}>
      {arrayLetters?.map((item, index) => (
        <span key={index} style={{ "--i": index + 1 }}>
          {item === " " ? "\u00A0" + "\u00A0" : item}
        </span>
      ))}
    </div>
  );
}
