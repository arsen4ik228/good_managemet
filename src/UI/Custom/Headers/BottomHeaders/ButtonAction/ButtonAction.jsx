import React, { useState, useRef, useEffect } from "react";
import classes from "./ButtonAction.module.css";
import iconAdd from "../../../../image/iconAdd.svg";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";
import shareIcon from "@Custom/icon/icon _ share.svg";
import { notEmpty } from "@helpers/helpers"

export default function ButtonAction({ create, update, shareFunctionList, refShare, refUpdate, refCreate }) {
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const menuRef = useRef(null);

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.wrapper}>
      {create && (
        <ButtonImage
          refAction={refCreate}
          name={"Создать"}
          icon={iconAdd}
          onClick={create}
        />
      )}
      {notEmpty(shareFunctionList) && (
        <div className={classes.shareIconContainer} ref={menuRef}>
          <ButtonImage
            refAction={refShare}
            name={"Поделиться"}
            icon={shareIcon}
            onClick={() => setOpenShareMenu(!openShareMenu)}
          />

          <ul className={`${classes.menuList} ${openShareMenu ? classes.open : ""}`}>
            {shareFunctionList.map((item, index) => (
              <li key={index} onClick={item.func} >{item.title}</li>
            ))}
          </ul>
        </div>
      )}

      {update && (
        <ButtonImage
          refAction={refUpdate}
          name={"Обновить"}
          icon={Blacksavetmp}
          onClick={update}
        />
      )}
    </div>
  );
}