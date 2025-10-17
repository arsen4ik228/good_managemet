import _ from "lodash";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const calculateInitialDate = (datePoint) => {
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

export const countDays = (datePoint, statisticData, setDataSource) => {
  const baseId = Date.now();
  const startDate = dayjs(datePoint).startOf("day");

  // Последние 7 дат (строки)
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    startDate.subtract(i, "day").format("YYYY-MM-DD")
  );

  // Нормализуем входящие данные (только дни)
  const normalizedData = _.cloneDeep(statisticData)
    .filter(
      (item) => !["Неделя", "Месяц", "Год"].includes(item.correlationType)
    )
    .map((item, index) => {
      const dateObj = dayjs(item.valueDate).startOf("day");
      return {
        id: item?.id ?? `day-${index}-${dateObj.format("YYYY-MM-DD")}`,
        value: item.value ?? null,
        valueDate: dateObj.format("YYYY-MM-DD"),
      };
    });

  // Карта для быстрого поиска по датам
  const dataByDate = new Map(
    normalizedData.map((item) => [item.valueDate, item])
  );

  // Финальный массив из 7 дней
  const daysArray = weekDates
    .map((dateStr, i) => {
      if (dataByDate.has(dateStr)) {
        return dataByDate.get(dateStr);
      }
      return {
        id: `day-${baseId}-${i}`,
        value: null,
        valueDate: dateStr,
        isCreate: true,
      };
    })
    .sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate));

  setDataSource(daysArray);
};

export const countWeeks = (
  quantity,
  datePoint,
  statisticData,
  setDataSource
) => {
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
      const parsed = parseFloat(weekTotalPoint.value);
      week.value = isNaN(parsed) ? null : parsed;
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

export const countMonths = (statisticData, setDataSource) => {
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

export const countYears = (statisticData, setDataSource) => {
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
