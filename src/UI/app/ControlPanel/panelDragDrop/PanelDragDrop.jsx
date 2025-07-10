import React from "react";
import classes from "./PanelDragDrop.module.css";
import setting from "@image/setting.svg";
import exitModal from "@image/exitModal.svg";

export default function PanelDragDrop({ name, openSetting, onClick, deletePanel, isActive }) {
  return (
    <div data-tour="controlPanel" title={name} className={`${classes.block} ${isActive ? classes.active : ""}`} onClick = {onClick}>
      <div className={classes.name}>
        <span>{name}</span>
      </div>
      <div className={classes.button}>
        <img data-tour="setting-controlPanel" src={setting} alt="setting" onClick={(e) => {
          // e.stopPropagation();
          openSetting();
        }} />
        <img data-tour="delete-controlPanel" src={exitModal} alt="exitModal" onClick= {(e) => {
          // e.stopPropagation();
          deletePanel();
        }}/>
      </div>
    </div>
  );
}
