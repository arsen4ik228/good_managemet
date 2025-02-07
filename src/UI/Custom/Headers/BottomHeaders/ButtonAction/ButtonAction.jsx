import React from "react";
import classes from "./ButtonAction.module.css";
import iconAdd from "../../../../image/iconAdd.svg";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";
export default function ButtonAction({ create, update }) {
  return (
    <div className={classes.wrapper}>
      {create && (
        <ButtonImage
          name={"создать"}
          icon={iconAdd}
          onClick={create}
        ></ButtonImage>
      )}

      {update && (
        <ButtonImage
          name={"обновить"}
          icon={Blacksavetmp}
          onClick={update}
        ></ButtonImage>
      )}
    </div>
  );
}
