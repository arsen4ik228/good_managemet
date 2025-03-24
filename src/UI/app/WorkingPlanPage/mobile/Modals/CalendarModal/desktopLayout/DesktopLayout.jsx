import React from "react";

import { Popconfirm, Flex, Typography } from "antd";
import calenderIcon from "@Custom/icon/icon _ calendar.svg";

import { DatePicker, ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru"); // Устанавливаем русский язык для dayjs


export default function DesktopLayout({
  setOpenModal,
  dateStart,
  setDateStart,
  dateDeadline,
  setDateDeadline,
  disableDateStart,
}) {
  return (
    <Popconfirm
      placement="topLeft"
      description={
        <Flex vertical gap={"small"}>
          <ConfigProvider locale={ruRU}>
            <Typography> Начало исполнения</Typography>
            <DatePicker
              format="DD.MM.YYYY"
              placeholder="Выберите дату"
              value={dayjs(dateStart)}
              disabled={disableDateStart}
              onChange={(date) => setDateStart(date)}
            />
          </ConfigProvider>

          <ConfigProvider locale={ruRU}>
            <Typography> Дата завершения</Typography>
            <DatePicker
              format="DD.MM.YYYY"
              placeholder="Выберите дату"
              value={dayjs(dateDeadline)}
              onChange={(date) => setDateDeadline(date)}
            />
          </ConfigProvider>
        </Flex>
      }
      showCancel={false} // Убираем кнопку "Отмена"
      okButtonProps={{ style: { display: "none" } }} // Прячем кнопку "ОК"
      icon={null}
    >
      <img src={calenderIcon} alt="calenderIcon" />
    </Popconfirm>
  );
}
