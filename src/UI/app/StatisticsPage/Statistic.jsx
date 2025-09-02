import { useState, useEffect } from "react";
import classes from "./Statistic.module.css";

import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import HandlerQeury from "@Custom/HandlerQeury.jsx";

import Graphic from "../Graphic/Graphic";
import ListStatisticDrawer from "./ListStatisticDrawer";
import { StatisticInformationDrawer } from "./StatisticInformationDrawer";
import ModalCreateStatistic from "./ModalCreateStatistic";

import { useGetSingleStatistic } from "@hooks";

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
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import useGetReduxOrganization from "../../../hooks/useGetReduxOrganization";
import { DrawerStatisticTable } from "./DrawerStatisticTable";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title } = Typography;

const typeViewStatistic = [
  { value: "daily", icon: <SunOutlined />, tooltip: "Ежедневный" },
  { value: "monthly", icon: <MoonOutlined />, tooltip: "Ежемесячный" },
  { value: "yearly", icon: <CalendarOutlined />, tooltip: "Ежегодовой" },
  { value: "thirteen", label: "13", tooltip: "13 недель" },
  { value: "twenty_six", label: "26", tooltip: "26 недель" },
  { value: "fifty_two", label: "52", tooltip: "52 недели" },
];

const widthMap = {
  fifty_two: "100%",
  twenty_six: "70%",
  default: "35%",
};

export default function Statistic() {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const [openCreateStatistic, setOpenCreateStatistic] = useState(false);
  const [openStatisticInformationDrawer, setOpenStatisticInformationDrawer] =
    useState(false);

  const [openDrawerStatisticTable, setOpenDrawerStatisticTable] =
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

  const countWeeks = (quantity) => {
    const reportDay = parseInt(localStorage.getItem("reportDay"), 10) || 0; // 0-воскр, 6-суббота
    const data = _.cloneDeep(statisticData);

    // Создаем массив 13 предыдущих недель (исключая текущую)
    const weeksArray = Array.from({ length: quantity }, (_, i) => {
      const second_to_last_Date = dayjs(datePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .subtract(1, "day")
        .endOf("day"); // Конец дня

      const date_for_view_days_in_week = dayjs(datePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .endOf("day") // Конец дня
        .format("YYYY-MM-DD");

      const endDate = dayjs(datePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .endOf("day"); // Конец дня

      return {
        id: `week-${i}-${endDate.format("YYYY-MM-DD")}`,
        valueDate: endDate.format("YYYY-MM-DD"),
        valueDateForCreate: second_to_last_Date,
        dateForViewDaysInWeek: date_for_view_days_in_week,
        value: null,
        isViewDays: false,
        correlationType: null,
      };
    });

    // Заполняем данные с правильным учетом недельных интервалов
    weeksArray.forEach((week) => {
      const weekEnd = dayjs(week.valueDate).endOf("day");
      const weekStart = weekEnd.subtract(6, "day").startOf("day");

      const weekPoints = data.filter((point) => {
        const pointDate = dayjs(point.valueDate);
        return (
          pointDate.isSameOrAfter(weekStart) &&
          pointDate.isSameOrBefore(weekEnd) &&
          point.correlationType !== "Месяц" &&
          point.correlationType !== "Год"
        );
      });

      const weekTotalPoint = weekPoints.find(
        (p) => p.correlationType === "Неделя"
      );

      if (weekTotalPoint) {
        week.value = parseFloat(weekTotalPoint.value) || null;
        week.id = weekTotalPoint.id;
        week.correlationType = "Неделя";
      } else {
        week.value = weekPoints.reduce((sum, point) => {
          const pointValue = parseFloat(point.value);

          if (isNaN(pointValue)) {
            return sum; // пропускаем нечисловые значения
          }

          return sum === null ? pointValue : sum + pointValue;
        }, null);
      }
    });

    setDataSource(
      weeksArray.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
    );
  };

  const countMonths = () => {
    const monthsArray = _.cloneDeep(statisticData)
      .map((item, index) => {
        const dateObj = dayjs(new Date(item.year, item.month - 1, 15));

        return {
          id: item?.id ?? `month-${index}-${dateObj.format("YYYY-MM")}`,
          value: item.total,
          correlationType: item.correlationType,
          valueDate: dateObj.format("YYYY-MM"), // форматируем как строку
          valueDateForCreate: dateObj, // оставляем как объект Day.js
        };
      })
      .sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate));

    setDataSource(monthsArray);
  };

  const countYears = () => {
    const yearsArray = _.cloneDeep(statisticData)
      .map((item, index) => {
        const dateObj = dayjs(new Date(item.year, 6, 15));

        return {
          id: item?.id ?? `year-${index}-${dateObj.format("YYYY")}`,
          value: item.total,
          correlationType: item.correlationType,
          valueDate: dateObj.format("YYYY"),
          valueDateForCreate: dateObj,
        };
      })
      .sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate));
    setDataSource(yearsArray);
  };

  const countDays = () => {
    setDataSource(
      _.cloneDeep(statisticData).sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      )
    );

    const baseId = Date.now();
    const startDate = dayjs(datePoint).startOf("day");

    const existingDates = new Set(
      statisticData
        ?.filter(
          (item) => !["Неделя", "Месяц", "Год"].includes(item.correlationType)
        )
        .map((item) =>
          dayjs(item.valueDate).startOf("day").format("YYYY-MM-DD")
        ) || []
    );

    const newData = Array(7)
      .fill()
      .map((_, i) => {
        // Добавляем дни без учета временной зоны
        const date = startDate.subtract(i, "day").startOf("day");

        if (!date || !date.isValid?.()) {
          console.error("Некорректная дата на шаге", i, date);
          return null;
        }
        return {
          id: baseId + i,
          value: null,
          valueDate: date.format("YYYY-MM-DD"),
        };
      })
      .filter(Boolean)
      .filter((item) => !existingDates.has(item.valueDate))
      .sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate));

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
    setDatePoint(() => {
      return calculateInitialDate();
    });
  }, [chartType]);

  useEffect(() => {
    if (!clickArrow[0] || !datePoint) return;

    setDatePoint((prev) => {
      const currentDate = dayjs(prev);
      let newDate;

      switch (chartType) {
        case "daily":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(1, "day")
              : currentDate.subtract(1, "day");
          break;
        case "thirteen":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(7, "day")
              : currentDate.subtract(7, "day");
          break;
        case "twenty_six":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(42, "day")
              : currentDate.subtract(42, "day");
          break;
        case "fifty_two":
          newDate =
            clickArrow[0] === "right"
              ? currentDate.add(91, "day")
              : currentDate.subtract(91, "day");
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

  useEffect(() => {
    if (!statisticId || !datePoint) return;

    const handlers = {
      daily: countDays,
      monthly: countMonths,
      yearly: countYears,
      thirteen: () => countWeeks(13),
      twenty_six: () => countWeeks(26),
      fifty_two: () => countWeeks(52),
    };

    const handler = handlers[chartType];
    if (!handler) return;

    setCreatePoints([]);
    handler();
  }, [statisticData, chartType, datePoint]);

  useEffect(() => {
    setDataSource([]);
    setCreatePoints([]);
    setStatisticId(null);
  }, [reduxSelectedOrganizationId]);

  return (
    <div className={classes.dialog}>
      <Headers name={"статистика"}>
        <BottomHeaders create={() => setOpenCreateStatistic(true)}>
          <Button
            onClick={() => {
              setOpenListStatisticDrawer((prev) => !prev);
              setOpenDrawerStatisticTable(false);
              setOpenStatisticInformationDrawer(false);
            }}
          >
            Выбрать статистику
          </Button>

          {statisticId ? (
            <>
              <Button
                onClick={() => {
                  setOpenStatisticInformationDrawer((prev) => !prev);
                  setOpenDrawerStatisticTable(false);
                  setOpenListStatisticDrawer(false);
                }}
              >
                Редактировать статистику
              </Button>

              <Button
                onClick={() => {
                  setOpenDrawerStatisticTable((prev) => !prev);
                  setOpenStatisticInformationDrawer(false);
                  setOpenListStatisticDrawer(false);
                }}
              >
                Внести данные
              </Button>
            </>
          ) : null}
        </BottomHeaders>
      </Headers>

      <div className={classes.main}>
        <>
          <HandlerQeury
            Error={isErrorGetStatisticId}
            Loading={isLoadingGetStatisticId}
            Fetching={isFetchingGetStatisticId}
          ></HandlerQeury>

          {statisticId ? (
            <>
              <Title level={4} style={{ color: "#3E7B94" }}>
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

                <div
                  style={{
                    flex: 1, // Занимает всё доступное пространство
                    display: "flex",
                    justifyContent: "center", // Центрирует по горизонтали
                    alignItems: "center", // Центрирует по вертикали (опционально)
                  }}
                >
                  <Graphic
                    data={[...createPoints, ...dataSource]}
                    width={widthMap[chartType] || widthMap.default}
                  />
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
                currentStatistic={currentStatistic}
                isLoadingGetStatisticId={isLoadingGetStatisticId}
                isFetchingGetStatisticId={isFetchingGetStatisticId}
              />

              <DrawerStatisticTable
                openDrawer={openDrawerStatisticTable}
                setOpenDrawer={setOpenDrawerStatisticTable}
                dataSource={dataSource}
                setDataSource={setDataSource}
                createPoints={createPoints}
                setCreatePoints={setCreatePoints}
                setDatePoint={setDatePoint}
                chartType={chartType}
                currentStatistic={currentStatistic}
                isLoadingGetStatisticId={isLoadingGetStatisticId}
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
