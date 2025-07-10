import React, { useState, useEffect } from "react";
import classes from "./Statistic.module.css";

import { StatisticInformationDrawer } from "./StatisticInformationDrawer";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";

import Graphic from "../Graphic/Graphic";

import { Button, Space, Tooltip, Flex, Typography } from "antd";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  EditOutlined,
  SunOutlined,
  MoonOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

import _ from "lodash";
import dayjs from "dayjs";
import ListStatisticDrawer from "./ListStatisticDrawer";

import { useGetSingleStatistic } from "@hooks";
import ModalCreateStatistic from "./ModalCreateStatistic";

const { Title } = Typography;

const typeViewStatistic = [
  { value: "daily", icon: <SunOutlined />, tooltip: "Ежедневный" },
  { value: "monthly", icon: <MoonOutlined />, tooltip: "Ежемесячный" },
  { value: "yearly", icon: <CalendarOutlined />, tooltip: "Ежегодовой" },
  { value: "thirteen", label: "13", tooltip: "13 недель" },
  { value: "twenty_six", label: "26", tooltip: "26 недель" },
  { value: "fifty_two", label: "52", tooltip: "52 недели" },
];

export default function Statistic() {
  const [openCreateStatistic, setOpenCreateStatistic] = useState(false);
  const [openStatisticInformationDrawer, setOpenStatisticInformationDrawer] =
    useState(false);

  const [statisticId, setStatisticId] = useState(null);
  const [openListStatisticDrawer, setOpenListStatisticDrawer] = useState(true);

  const [chartType, setChartType] = useState("daily");
  const [clickArrow, setClickArrow] = useState([null, null]);

  const [datePoint, setDatePoint] = useState(null);

  const [dataSource, setDataSource] = useState([]);
  const [createPoints, setCreatePoints] = useState([]);

  // Получение статистики по id
  const {
    currentStatistic,
    statisticData,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  } = useGetSingleStatistic({
    // statisticId: "76c273da-ed80-4da2-b6ef-72133830a1f3",
    statisticId: statisticId,

    // datePoint: "2025-06-26",
    datePoint: datePoint,

    viewType: chartType,
  });

  const calculateInitialDate = () => {
    const currentDate = localStorage.getItem("reportDay");
    if (currentDate !== null) {
      const targetDay = parseInt(currentDate, 10);
      const today = new Date();
      const todayDay = today.getDay();

      let diff = todayDay - targetDay;
      if (diff < 0) diff += 7;

      const lastTargetDate = new Date(today);
      lastTargetDate.setDate(today.getDate() - diff);

      return lastTargetDate.toISOString().split("T")[0];
    }
    return datePoint;
  };

  useEffect(() => {
    setDatePoint(() => {
      return calculateInitialDate();
    });
  }, [chartType]);

  // 2. Обработка кликов по стрелкам
  useEffect(() => {
    if (!clickArrow[0] || !datePoint) return;

    setDatePoint((prev) => {
      const currentDate = dayjs(prev);
      let newDate;

      switch (chartType) {
        case "daily":
        case "thirteen":
        case "twenty_six":
        case "fifty_two":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(7, "day")
              : currentDate.subtract(7, "day");
          break;
        case "monthly":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(1, "month").date(15)
              : currentDate.subtract(1, "month").date(15);
          break;
        case "yearly":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(1, "year").month(5).date(15)
              : currentDate.subtract(1, "year").month(5).date(15);
          break;
        default:
          return prev;
      }

      return newDate.format("YYYY-MM-DD");
    });
  }, [clickArrow]);

  const countWeeks = (quantity) => {
    const reportDay = parseInt(localStorage.getItem("reportDay"), 10) || 0; // 0-воскр, 6-суббота
    const data = _.cloneDeep(statisticData);

    // Создаем массив 13 предыдущих недель (исключая текущую)
    const weeksArray = Array.from({ length: quantity }, (_, i) => {
      const second_to_last_Date = dayjs(datePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i + 1, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .subtract(1, "day")
        .endOf("day"); // Конец дня

      const date_for_view_days_in_week = dayjs(datePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i + 1, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .subtract(7, "day")
        .endOf("day") // Конец дня
        .format("YYYY-MM-DD");

      const endDate = dayjs(datePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i + 1, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .endOf("day"); // Конец дня

      return {
        id: `week-${i}-${endDate.format("YYYY-MM-DD")}`,
        valueDate: endDate.format("YYYY-MM-DD"),
        valueDateForCreate: second_to_last_Date,
        dateForViewDaysInWeek: date_for_view_days_in_week,
        value: 0,
        isViewDays: false,
        correlationType: null,
      };
    }).reverse();

    // Заполняем данные с правильным учетом недельных интервалов
    weeksArray.forEach((week) => {
      const weekEnd = dayjs(week.valueDate);
      const weekStart = weekEnd.subtract(7, "day");

      const weekPoints = data.filter((point) => {
        const pointDate = dayjs(point.valueDate);
        return (
          pointDate.isSameOrAfter(weekStart) &&
          pointDate.isBefore(weekEnd) &&
          point.correlationType !== "Месяц" &&
          point.correlationType !== "Год"
        );
      });

      const weekTotalPoint = weekPoints.find(
        (p) => p.correlationType === "Неделя"
      );

      if (weekTotalPoint) {
        week.value = parseFloat(weekTotalPoint.value) || 0;
        week.id = weekTotalPoint.id;
        week.correlationType = "Неделя";
      } else {
        week.value = weekPoints.reduce(
          (sum, point) => sum + (parseFloat(point.value) || 0),
          0
        );
      }
    });

    setDataSource(weeksArray);
  };

  const countMonths = () => {
    const monthsArray = _.cloneDeep(statisticData).map((item, index) => ({
      id:
        item?.id ??
        `month-${index}-${dayjs()
          .year(item.year)
          .month(item.month - 1)
          .format("YYYY-MM")}`,
      value: item.total,
      correlationType: item.correlationType,
      valueDate: dayjs()
        .year(item.year)
        .month(item.month - 1)
        .format("YYYY-MM"),
      valueDateForCreate: dayjs()
        .year(item.year)
        .month(item.month - 1)
        .day(15),
    }));
    setDataSource(monthsArray);
  };

  const countYears = () => {
    const yearsArray = _.cloneDeep(statisticData).map((item, index) => ({
      id:
        item?.id ?? `month-${index}-${dayjs().year(item.year).format("YYYY")}`,
      value: item.total,
      correlationType: item.correlationType,
      valueDate: dayjs().year(item.year).format("YYYY"),
      valueDateForCreate: dayjs().year(item.year).month(6).day(15),
    }));
    setDataSource(yearsArray);
  };

  const countDays = () => {
    setDataSource(_.cloneDeep(statisticData));

    const baseId = Date.now();
    const startDate = dayjs(datePoint); // Или dayjs("2025-05-29")

    // Создаем Set для быстрого поиска существующих дат
    const existingDates = new Set(
      statisticData
        ?.filter(
          (item) => !["Неделя", "Месяц", "Год"].includes(item.correlationType)
        )
        .map((item) => dayjs(item.valueDate).format("YYYY-MM-DD")) || []
    );
    const newData = Array(7)
      .fill()
      .map((_, i) => {
        const date = startDate.add(i, "day");
        if (!date || !date.isValid?.()) {
          // Проверка валидности
          console.error("Некорректная дата на шаге", i, date);
          return null;
        }
        return {
          id: baseId + i,
          value: 0,
          valueDate: date.toDate().toISOString(), // Преобразуем в JS Date
          dateStr: date.format("YYYY-MM-DD"),
        };
      })
      .filter(Boolean) // Удаляем возможные null
      .filter((item) => !existingDates.has(item.dateStr))
      .map(({ dateStr, ...rest }) => rest);

    setCreatePoints([...newData]);
  };

  const handleResetTable = () => {
    setCreatePoints([]);

    if (chartType === "daily") {
      countDays();
    }

    if (chartType === "monthly") {
      countMonths();
    }

    if (chartType === "yearly") {
      countYears();
    }

    if (chartType === "thirteen") {
      countWeeks(13);
    }
    if (chartType === "twenty_six") {
      countWeeks(26);
    }
    if (chartType === "fifty_two") {
      countWeeks(52);
    }
  };

  useEffect(() => {
    if (!statisticData) return;

    setCreatePoints([]);

    if (chartType === "daily") {
      countDays();
    }

    if (chartType === "monthly") {
      countMonths();
    }

    if (chartType === "yearly") {
      countYears();
    }

    if (chartType === "thirteen") {
      countWeeks(13);
    }
    if (chartType === "twenty_six") {
      countWeeks(26);
    }
    if (chartType === "fifty_two") {
      countWeeks(52);
    }
  }, [statisticData, datePoint]);

  return (
    <div className={classes.dialog}>
      <Headers name={"статистика"}>
        <BottomHeaders create={() => setOpenCreateStatistic(true)}>
          <Tooltip title="Выбор статистик" placement="bottom">
            <Button
              type="primary"
              icon={<MenuFoldOutlined />}
              onClick={() => setOpenListStatisticDrawer((prev) => !prev)}
            />
          </Tooltip>
        </BottomHeaders>
      </Headers>

      <div className={classes.main}>
        <>
          {statisticId ? (
            <>
              <Button
                onClick={() =>
                  setOpenStatisticInformationDrawer((prev) => !prev)
                }
                icon={<EditOutlined />}
              >
                Редактировать статистику
              </Button>

              <Title level={4} style={{ color: "#1890ff" }}>
                {currentStatistic.name}
              </Title>

              <Flex
                style={{
                  width: "100%",
                  height: "100%",
                }}
                gap="small"
              >
                {/* График - теперь первый элемент, растягивается на всё оставшееся пространство */}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Graphic data={[...createPoints, ...dataSource]} />
                </div>

                {/* Панель кнопок - сдвигается вправо */}
                <Flex
                  gap="middle"
                  vertical
                  justify="center"
                  align="center"
                  style={{
                    marginLeft: "auto", // Это сдвигает блок вправо
                    padding: "0 16px",
                    borderLeft: "1px solid #f0f0f0", // Визуальное разделение
                    backgroundColor: "#fff",
                  }}
                >
                  {typeViewStatistic.map((item) => (
                    <Tooltip
                      title={item.tooltip}
                      key={item.value}
                      placement="left"
                    >
                      <Button
                        type={chartType === item.value ? "primary" : "default"}
                        onClick={() => setChartType(item.value)}
                        icon={item?.icon}
                        style={{
                          width: "35px", // Одинаковая ширина для всех кнопок
                        }}
                      >
                        {item?.label}
                      </Button>
                    </Tooltip>
                  ))}
                </Flex>
              </Flex>

              <Space
                size="large"
                align="center"
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="сдвигает график влево" placement="left">
                  <Button
                    icon={<LeftCircleOutlined />}
                    onClick={() => setClickArrow(["left", new Date()])}
                  />
                </Tooltip>

                <Tooltip title="сдвигает график вправо" placement="right">
                  <Button
                    icon={<RightCircleOutlined />}
                    onClick={() => setClickArrow(["right", new Date()])}
                    style={{
                      marginRight: 50,
                    }}
                  />
                </Tooltip>
              </Space>

              <StatisticInformationDrawer
                openDrawer={openStatisticInformationDrawer}
                setOpenDrawer={setOpenStatisticInformationDrawer}
                statisticId={statisticId}
                dataSource={dataSource}
                setDataSource={setDataSource}
                createPoints={createPoints}
                setCreatePoints={setCreatePoints}
                setDatePoint={setDatePoint}
                chartType={chartType}
                currentStatistic={currentStatistic}
                isLoadingGetStatisticId={isLoadingGetStatisticId}
                statisticData={statisticData}
                isFetchingGetStatisticId={isFetchingGetStatisticId}
                handleResetTable={handleResetTable}
              />
            </>
          ) : null}

          <ListStatisticDrawer
            open={openListStatisticDrawer}
            setOpen={setOpenListStatisticDrawer}
            statisticId={statisticId}
            setStatisticId={setStatisticId}
          />

          <ModalCreateStatistic
            open={openCreateStatistic}
            setOpen={setOpenCreateStatistic}
            setStatisticId={setStatisticId}
          />
        </>
      </div>
    </div>
  );
}
