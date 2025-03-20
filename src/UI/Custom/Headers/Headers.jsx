import React from "react";
import classes from "./Headers.module.css";
import TopHeaders from "./TopHeaders/TopHeaders";

export default function Headers({children, name, back, speedGoal, sectionName, avatar}) {
  return (
    <div className={classes.header}>
      <TopHeaders name={name} back={back} speedGoal={speedGoal} sectionName={sectionName} avatar={avatar}></TopHeaders>
      {children}
    </div>
  );
}
