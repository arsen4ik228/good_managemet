import React, { useState, useEffect } from "react";
import classes from "./StartContent.module.css";
import icon from "../../../../image/iconHeader.svg";
import iconBack from "../../../../image/iconBack.svg";
import WaveLetters from "../../../../Custom/WaveLetters.jsx";
import { useNavigate, useParams } from "react-router-dom";

export default function StartContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/pomoshnik/start`);
  };

  const [type, setType] = useState("null");

  useEffect(() => {
    if (type === "Проект") {
      navigate(`/${userId}/pomoshnik/project`);
    }
    if (type === "Программа") {
      navigate(`/${userId}/pomoshnik/program`);
    }
  }, [type]);

  return (
    <div className={classes.dialog}>
      <div className={classes.header}>
        <div className={classes.fon}></div>
        <div className={classes.pomoshnikSearch}>
          <div className={classes.pomoshnik}>
            <img
              src={iconBack}
              alt="iconBack"
              onClick={() => back()}
              className={classes.iconBack}
            />
            <div>
              <img
                src={icon}
                alt="icon"
                style={{ width: "33px", height: "33px" }}
              />
            </div>

            <div className={classes.spanPomoshnik}>
              <span>Личный помощник</span>
            </div>
          </div>
          <input type="search" placeholder="Поиск" className={classes.search} />
        </div>

        <div className={classes.editText}>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                Тип <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <select
                className={classes.select}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                <option value="null" disabled>
                  Выбрать тип
                </option>
                <option value="Проект">Проект</option>
                <option value="Программа">Программа</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        <WaveLetters letters={"Выберите программу или проект"}></WaveLetters>
      </div>
    </div>
  );
}
