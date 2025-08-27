import { useState, useEffect, useMemo } from "react";
import classes from "./Svodka.module.css";
import Headers from "@Custom/Headers/Headers";

import { useAllStatistics } from "@hooks/Statistics/useAllStatistics";

import { Table, Flex, Button } from "antd";

import _ from "lodash";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const countWeeks = [
  { label: "квартал 95", value: 13 },
  { label: "полгода", value: 26 },
  { label: "полгода - пол", value: 52 },
];

export default function Svodka() {
  const [allStatistics, setAllStatistics] = useState([]);
  const [datePoint, setDatePoint] = useState(null);
  const [week, setWeek] = useState(13);

  const {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  } = useAllStatistics({
    statisticData: true,
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
    return null;
  };

  // Функция для генерации недельных данных (аналогично countWeeks)
  const generateWeeklyData = (statisticData, quantity, baseDate) => {
    const reportDay = parseInt(localStorage.getItem("reportDay"), 10) || 0;
    const data = _.cloneDeep(statisticData);

    // Создаем массив 13 предыдущих недель
    const weeksArray = Array.from({ length: quantity }, (_, i) => {
      const endDate = dayjs(baseDate)
        .day(reportDay)
        .subtract(i, "week")
        .endOf("day");

      return {
        date: endDate.format("DD.MM.YY"),
        valueDate: endDate.format("YYYY-MM-DD"),
        value: 0,
        isViewDays: false,
        correlationType: null,
      };
    }).reverse();

    // Заполняем данные для каждой недели
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
        week.value = parseFloat(weekTotalPoint.value) || 0;
      } else {
        week.value = weekPoints.reduce(
          (sum, point) => sum + (parseFloat(point.value) || 0),
          0
        );
      }
    });

    return weeksArray.reverse();
  };

  // Функция для генерации колонок
  const generateWeekColumns = useMemo(() => {
    if (!datePoint) return [];

    const weeklyData = generateWeeklyData([], week, datePoint);
    const columns = [];

    weeklyData.forEach((week, index) => {
      columns.push({
        title: (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            {week.date}
          </div>
        ),
        dataIndex: `week_${index}`,
        key: `week_${index}`,
        width: 120,
        align: "center",
        render: (value) => <span>{value ?? "0"}</span>,
      });
    });

    return columns;
  }, [datePoint, week]);

  // Базовые колонки
  const baseColumns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text) => <span>{text}</span>,
    //   width: 80,
    //   fixed: "left",
    // },
    {
      title: "Название статистики",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
      maxWidth: 100,
      fixed: "left",
      ellipsis: true,
    },
  ];

  // Объединяем колонки
  const columns = [...baseColumns, ...generateWeekColumns];

  // Подготовка данных для таблицы (аналогично countWeeks)
  const tableData = useMemo(() => {
    if (!allStatistics.length || !datePoint) return [];

    return allStatistics.map((statisticItem) => {
      const rowData = {
        id: statisticItem.id,
        name: statisticItem.name,
        key: statisticItem.id,
      };

      // Генерируем недельные данные для каждой статистики
      const weeklyData = generateWeeklyData(
        statisticItem.statisticDatas || [],
        week,
        datePoint
      );

      // Добавляем данные для каждой недели в строку
      weeklyData.forEach((week, index) => {
        rowData[`week_${index}`] = week.value;
      });

      return rowData;
    });
  }, [allStatistics, datePoint, week]);

  useEffect(() => {
    const initialDate = calculateInitialDate();
    if (initialDate) {
      setDatePoint(initialDate);
    }
  }, []);

  useEffect(() => {
    if (statistics && statistics.length > 0) {
      const _statistics = _.cloneDeep(statistics);
      setAllStatistics(_statistics);
    }
  }, [statistics]);

  return (
    <div className={classes.dialog}>
      <Headers name={"сводка"}></Headers>
      <div className={classes.main}>
        <Flex gap="middle" justify="center">
          {countWeeks.map((item) => (
            <Button
              type={week === item.value ? "primary" : "default"}
              onClick={() => setWeek(item.value)}
              style={{
                width: "auto", // Одинаковая ширина для всех кнопок
              }}
            >
              {item?.label}
            </Button>
          ))}
        </Flex>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoadingGetStatistics || isFetchingGetStatistics}
          scroll={{
            y: "100%",
            x: "max-content",
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
