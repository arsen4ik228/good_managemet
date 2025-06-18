import React from "react";
import classes from "./TopHeaders.module.css";
import iconBack from "../../../image/iconBack.svg";
import iconHeader from "../../../image/iconHeader.svg";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { baseUrl } from "@helpers/constants";
import hint from "@image/hint.svg";
import { Tooltip } from 'antd';

export default function TopHeaders({
  back,
  name,
  speedGoal,
  sectionName,
  avatar,
  funcActiveHint
}) {
  const navigate = useNavigate();

  const handleBack = back || (() => navigate(`/pomoshnik/start`));

  const handleHintClick = () => {
    if (funcActiveHint && typeof funcActiveHint === 'function') {
      funcActiveHint();
    }
  };

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
          <img
            src={avatar ? `${baseUrl}${avatar}` : iconHeader}
            alt="iconHeader"
          />
          <div className={classes.spanPomoshnik} data-name={name}>
            <span>{sectionName}</span>
          </div>
        </div>

        <Tooltip placement="bottom" title={"Нажмите для подсказки по разделу"} overlayStyle={{ maxWidth: "200px", textAlign: "center" }}>
          <img
            className={classes.buttonHealper}
            src={hint}
            alt="Подсказка"
            onClick={handleHintClick}
          />
        </Tooltip>
      </div>
    </>
  );
}

TopHeaders.propTypes = {
  back: PropTypes.func,
  name: PropTypes.string,
  speedGoal: PropTypes.string,
  sectionName: PropTypes.string,
  avatar: PropTypes.string,
  funcActiveHint: PropTypes.func,
};

TopHeaders.defaultProps = {
  back: null,
  name: null,
  speedGoal: null,
  sectionName: "Личный помощник",
  avatar: null,
  funcActiveHint: null,
};
