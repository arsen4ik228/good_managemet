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

export const countDays = (datePoint, statisticData, setDataSource, setCreatePoints) => {
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

export const countWeeks = (quantity, datePoint, statisticData, setDataSource) => {
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

