import React from "react";
import classes from "./ButtonAction.module.css";
import iconAdd from "../../../../image/iconAdd.svg";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";
export default function ButtonAction({ create, update, refUpdate, refCreate }) {
  return (
    <div className={classes.wrapper}>
      {create && (
        <ButtonImage
          refAction={refCreate}
          name={"создать"}
          icon={iconAdd}
          onClick={create}
        ></ButtonImage>
      )}

      {update && (
        <ButtonImage
          refAction={refUpdate}
          name={"обновить"}
          icon={Blacksavetmp}
          onClick={update}
        ></ButtonImage>
      )}
    </div>
  );
}
