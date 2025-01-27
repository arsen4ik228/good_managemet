import React from "react";
import classes from "./TopHeaders.module.css";
import iconBack from "../../../image/iconBack.svg";
import iconHeader from "../../../image/iconHeader.svg";
import { useNavigate } from "react-router-dom";

export default function TopHeaders({ back, name, speedGoal }) {
  const navigate = useNavigate();

  const handleBack = back || (() => navigate(`/pomoshnik/start`));

  return (
    <>
      <div className={classes.fon}></div>
      <div className={`${classes.pomoshnikSearch} ${classes[speedGoal]}`}>
        <div className={classes.pomoshnik}>
          <img
            src={iconBack}
            alt="iconBack"
            onClick={() => handleBack()}
            className={classes.iconBack}
          />
          <div>
            <img
              src={iconHeader}
              alt="iconHeader"
              style={{ width: "33px", height: "33px" }}
            />
          </div>

          <div className={classes.spanPomoshnik} data-name={name}>
            <span>Личный помощник</span>
          </div>
        </div>
        <input type="search" placeholder="Поиск" className={classes.search} />
      </div>
    </>
  );
}
