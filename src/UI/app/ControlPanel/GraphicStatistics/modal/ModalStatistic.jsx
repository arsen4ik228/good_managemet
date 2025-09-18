import { useEffect, useState } from "react";
import { useGetSingleStatistic } from "@hooks";
import { Button, Space, Tooltip, Flex, Modal, Typography } from "antd";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  SunOutlined,
  MoonOutlined,
  CalendarOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import HandlerQeury from "@Custom/HandlerQeury.jsx";
import Graphic from "../../../Graphic/Graphic";

import _ from "lodash";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title } = Typography;


const typeViewStatistic = [
  { value: "thirteen", label: "13 недель" },
  { value: "twenty_six", label: "26 недель" },
  { value: "fifty_two", label: "52 недели" },
  { value: "daily", label: "По дням" },
  { value: "monthly", label: "По месяцам" },
  { value: "yearly", label: "По годам" },
];

const widthMap = {
    fifty_two: {
         height:"calc(100vh - 200px)", 
         width: "100%",
    },
    twenty_six: {
        height:"calc(100vh - 200px)", 
        width: "calc((100vh - 200px)*1.4)",
    },
    default: {
        height:"calc(100vh - 200px)", 
        width: "calc((100vh - 200px)/1.4)",
    },
};

const ModalStatistic = ({ selectedStatistic, openModal, setOpenModal }) => {
  const [dataSource, setDataSource] = useState([]);
  const [chartType, setChartType] = useState("thirteen");
  const [clickArrow, setClickArrow] = useState([null, null]);
  const [modalDatePoint, setModalDatePoint] = useState(null);

  // Получение статистики по id
  const {
    currentStatistic,
    statisticData,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  } = useGetSingleStatistic({
    statisticId: selectedStatistic?.id,
    datePoint: modalDatePoint,
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
    return modalDatePoint;
  };

  const countWeeks = (quantity) => {
    const reportDay = parseInt(localStorage.getItem("reportDay"), 10) || 0; // 0-воскр, 6-суббота
    const data = _.cloneDeep(statisticData);

    // Создаем массив 13 предыдущих недель (исключая текущую)
    const weeksArray = Array.from({ length: quantity }, (_, i) => {
      const second_to_last_Date = dayjs(modalDatePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .subtract(1, "day")
        .endOf("day"); // Конец дня

      const date_for_view_days_in_week = dayjs(modalDatePoint)
        .day(reportDay) // Устанавливаем день недели
        .subtract(i, "week") // Отступаем i+1 недель назад (исключаем текущую)
        .endOf("day") // Конец дня
        .format("YYYY-MM-DD");

      const endDate = dayjs(modalDatePoint)
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
    const startDate = dayjs(modalDatePoint).startOf("day");

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

    setDataSource((prev) => [...prev, ...newData]);
  };

  useEffect(() => {
    setModalDatePoint(() => {
      return calculateInitialDate();
    });
  }, [chartType]);

  useEffect(() => {
    if (!clickArrow[0] || !modalDatePoint) return;

    setModalDatePoint((prev) => {
      const currentDate = dayjs(prev);
      console.log("currentDate", currentDate.format("YYYY-MM-DD"));
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
    if (!statisticData) return;

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
  }, [statisticData, modalDatePoint]);

  return (
    <>
      <HandlerQeury
        Error={isErrorGetStatisticId}
        Loading={isLoadingGetStatisticId}
        Fetching={isFetchingGetStatisticId}
      ></HandlerQeury>

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        closeIcon={<CloseOutlined />}
        footer={null}
        width="90%"
        bodyStyle={{ height: "90vh" }}
        style={{
          top: "2vh",
        }}
      >
        <Title level={4} style={{ color: "#3E7B94", textAlign: "center" }}>
          {selectedStatistic?.name}
        </Title>

        <Flex
          style={{
            width: "100%",
            height: "90%",
          }}
          gap="small"
        >
          {/* График - теперь первый элемент, растягивается на всё оставшееся пространство */}

          {/* График - центрируется */}
          <div
            style={{
              flex: 1, // Занимает всё доступное пространство
              display: "flex",
              justifyContent: "center", // Центрирует по горизонтали
              alignItems: "center", // Центрирует по вертикали (опционально)
            }}
          >
            <Graphic
              data={dataSource}
              widthObj={widthMap[chartType] || widthMap.default}
              type={selectedStatistic?.type}
            />
          </div>

          {/* Панель кнопок - сдвигается вправо */}
          <Flex
            gap="middle"
            vertical
            justify="center"
            align="center"
          >
            {typeViewStatistic.map((item) => (
              <Button
                disabled={false}
                onClick={() => setChartType(item.value)}
                style={{
                  width: "120px",
                  backgroundColor:
                    chartType === item.value ? "rgba(207, 222, 229, 0.5)" : "#fff",
                  color: chartType === item.value ? "#005475" : "#999999",
                  border: "1px solid #CFDEE5",
                  borderRadius: "6px",
                  fontWeight: 400,
                }}
              >
                {item.label}
              </Button>
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
      </Modal>
    </>
  );
};

export default ModalStatistic;
