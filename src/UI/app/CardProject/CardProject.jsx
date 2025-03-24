import React from "react";
import classes from "./CardProject.module.css";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import img from "./Lyashko.png";

import { Avatar, Input, Select, DatePicker, Typography } from "antd";

const { TextArea } = Input;

const { RangePicker } = DatePicker;

export default function CardProject() {
  return (
    <div className={classes.dialog}>
      <Headers name={"карточка"}>
        <BottomHeaders></BottomHeaders>
      </Headers>

      <div className={classes.main}>
        <div className={classes.card}>
          <div className={classes.cardLeft}>
            <TextArea placeholder="Текст задачи"  style={{height:'100%', resize: 'none'}}></TextArea>
          </div>

          <div className={classes.cardRight}>
            <div className={classes.avatar}>
              <Avatar size={64} src={img} />
              <div className={classes.textAvatar}>
                <Typography style={{ fontWeight: "bold"}}>  Президент</Typography>
                <Typography style={{ fontStyle: "italic" }}>  Илья Белошейкин</Typography>
              </div>
            </div>

            <Select
              style={{ width: "100%" }}
              defaultValue="Активный"
              options={[
                {
                  value: "Активный",
                  label: "Активный",
                },
                {
                  value: "Завершен",
                  label: "Завершен",
                },
                {
                  value: "Отменен",
                  label: "Отменен",
                },
              ]}
            ></Select>
            <RangePicker size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}
