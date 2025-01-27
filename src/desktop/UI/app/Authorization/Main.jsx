import React from "react";
import classes from "./Main.module.css";
import Header from "./header/Header.jsx";
import Content from "./content/Content.jsx";

export default function Main() {

  return (
    <div className={classes.main}>
      <Header></Header>
      <div className={classes.body}>
        <div className={classes.block}></div>
        <Content></Content>
      </div>
    </div>
  );
}
