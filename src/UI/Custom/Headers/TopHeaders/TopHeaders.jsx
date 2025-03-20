import React from "react";
import classes from "./TopHeaders.module.css";
import iconBack from "../../../image/iconBack.svg";
import iconHeader from "../../../image/iconHeader.svg";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { baseUrl } from '@helpers/constants'

export default function TopHeaders({ back, name, speedGoal, sectionName, avatar }) {
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
          <img
            src={avatar ? `${baseUrl}${avatar}` : iconHeader}
            alt="iconHeader"
          />
          <div className={classes.spanPomoshnik} data-name={name}>
            <span>{sectionName}</span>
          </div>
        </div>
        <input type="search" placeholder="Поиск" className={classes.search} />
      </div>
    </>
  );
}

TopHeaders.propTypes = {
  back: PropTypes.func,
  name: PropTypes.string,
  speedGoal: PropTypes.string,
  sectionName: PropTypes.string,
  avatar: PropTypes.string
}

TopHeaders.defaultProps = {
  back: null,
  name: null,
  speedGoal: null,
  sectionName: 'Личный помощник',
  avatar: null,
}