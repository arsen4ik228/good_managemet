import { useMemo } from "react";
import _ from "lodash";

import Graphic from "../../../Graphic/Graphic";

import dayjs from "dayjs";

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function GraphicForCard({ dataStatistics, datePoint }) {
  // Мемоизация данных статистики
  const dataSource = useMemo(() => {
    if (!dataStatistics) return [];

    const countWeeks = (quantity = 13) => {
      const reportDay = parseInt(localStorage.getItem("reportDay"), 10) || 0;
      const data = _.cloneDeep(dataStatistics);

      const weeksArray = Array.from({ length: quantity }, (_, i) => {
        const second_to_last_Date = dayjs(datePoint)
          .day(reportDay)
          .subtract(i, "week")
          .subtract(1, "day")
          .endOf("day");

        const date_for_view_days_in_week = dayjs(datePoint)
          .day(reportDay)
          .subtract(i, "week")
          .endOf("day")
          .format("YYYY-MM-DD");

        const endDate = dayjs(datePoint)
          .day(reportDay)
          .subtract(i, "week")
          .endOf("day");

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
          week.id = weekTotalPoint.id;
          week.correlationType = "Неделя";
        } else {
          week.value = weekPoints.reduce(
            (sum, point) => sum + (parseFloat(point.value) || 0),
            0
          );
        }
      });

      return weeksArray;
    };

    return countWeeks();
  }, [dataStatistics, datePoint]);

  return <Graphic data={dataSource} />;
}
