import React, { useState, useEffect, useMemo } from "react";
import classes from "./Svodka.module.css";
import Headers from "@Custom/Headers/Headers";
import { useAllStatistics } from "@hooks/Statistics/useAllStatistics";
import { useUpdateSvodka } from "@hooks";
import { Table, Flex, Button, InputNumber, message } from "antd";
import _ from "lodash";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const countWeeks = [
  { label: "квартал", value: 13 },
  { label: "полгода", value: 26 },
  { label: "год", value: 52 },
];

// --- Вспомогательные функции ---
const calculateInitialDate = () => {
  const currentDate = localStorage.getItem("reportDay");
  if (currentDate) {
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

const generateWeeklyData = (statisticData, quantity, baseDate) => {
  const reportDay = parseInt(localStorage.getItem("reportDay"), 10) || 0;
  const data = _.cloneDeep(statisticData);

  const weeksArray = Array.from({ length: quantity }, (_, i) => {
    const endDate = dayjs(baseDate)
      .day(reportDay)
      .subtract(i, "week")
      .endOf("day");

    return {
      date: endDate.format("DD.MM.YY"),
      valueDate: endDate.format("YYYY-MM-DD"),
      value: null,
      correlationType: null,
      _id: null,
    };
  });

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
      week._id = weekTotalPoint.id;
      week.correlationType = "Неделя";
    } else {
      week.value = weekPoints.reduce((sum, point) => {
        const pointValue = parseFloat(point.value);
        if (isNaN(pointValue)) return sum;
        return sum === null ? pointValue : sum + pointValue;
      }, null);
      week._id = null;
    }
  });

  return weeksArray.sort(
    (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
  );
};

// --- Компонент ---
export default function Svodka() {
  const [allStatistics, setAllStatistics] = useState([]);
  const [datePoint, setDatePoint] = useState(null);
  const [week, setWeek] = useState(13);
  const [editingCell, setEditingCell] = useState(null);
  const [saving, setSaving] = useState(false);

  const { statistics, isLoadingGetStatistics, isFetchingGetStatistics } =
    useAllStatistics({ statisticData: true });

  const { updateSvodka } = useUpdateSvodka();

  const [messageApi, contextHolder] = message.useMessage();

  // --- Функция сохранения значения ячейки ---
  const handleSaveCellValue = async ({
    rowId,
    colId,
    value,
    originalValue,
  }) => {
    if (value === originalValue) {
      setEditingCell(null);
      return;
    }

    const weeklyData = generateWeeklyData(
      allStatistics.find((item) => item.id === rowId)?.statisticDatas || [],
      week,
      datePoint
    );

    const cell = weeklyData[colId];
    const valueDate = dayjs(cell.valueDate).toISOString();

    try {
      setSaving(true);

      if (cell._id) {
        await updateSvodka({
          statisticId: rowId,
          _id: rowId,
          statisticDataUpdateDtos: [
            {
              _id: cell._id,
              value: value === "" ? null : value,
              correlationType: "Неделя",
            },
          ],
        }).unwrap();
      } else {
        await updateSvodka({
          statisticId: rowId,
          _id: rowId,
          statisticDataCreateDtos: [
            {
              valueDate,
              value: value === "" ? null : value,
              correlationType: "Неделя",
            },
          ],
        }).unwrap();
      }

      setAllStatistics((prev) =>
        prev.map((item) => {
          if (item.id !== rowId) return item;
          const statisticDatas = _.cloneDeep(item.statisticDatas) || [];
          if (cell._id) {
            const existingPoint = statisticDatas.find((p) => p.id === cell._id);
            if (existingPoint)
              existingPoint.value = value === "" ? null : value;
          } else {
            statisticDatas.push({
              value: value === "" ? null : value,
              correlationType: "Неделя",
              valueDate,
            });
          }
          return { ...item, statisticDatas };
        })
      );

      messageApi.success("Значение сохранено");
    } catch (err) {
      console.error("Ошибка при обновлении статистики:", err);
      messageApi.error("Ошибка при сохранении");
    } finally {
      setSaving(false);
      setEditingCell(null);
    }
  };

  // --- Колонки таблицы ---
  const columns = useMemo(() => {
    if (!datePoint) return [];

    const weeklyData = generateWeeklyData([], week, datePoint);

    return [
      {
        title: "Статистика",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        width: 150,
        ellipsis: true,
        render: (text) => (
          <div
            style={{
              width: "100%",
              maxWidth: "250px",
              wordWrap: "break-word",
              whiteSpace: "normal",
              lineHeight: "1.2",
              padding: "8px 4px",
              overflow: "hidden",
              display: "block",
            }}
            title={text}
          >
            {text}
          </div>
        ),
      },
      ...weeklyData.map((w, index) => ({
        title: (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            {w.date}
          </div>
        ),
        dataIndex: `week_${index}`,
        key: `week_${index}`,
        width: 160,
        align: "center",
        render: (cellData, record) => {
          const cellValue = cellData?.value ?? null;
          const isEditing =
            editingCell?.rowId === record.id && editingCell?.colId === index;

          if (isEditing) {
            const hasChanged = editingCell.value !== (cellValue ?? "");

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <InputNumber
                  autoFocus
                  value={editingCell.value === "" ? null : editingCell.value}
                  style={{ width: "100%" }}
                  decimalSeparator="."
                  onChange={(newVal) =>
                    setEditingCell((prev) => ({
                      ...prev,
                      value: newVal ?? "",
                    }))
                  }
                  onPressEnter={() =>
                    hasChanged &&
                    handleSaveCellValue({
                      ...editingCell,
                      originalValue: cellValue ?? "",
                    })
                  }
                />
                {hasChanged && (
                  <Button
                    type="primary"
                    size="small"
                    loading={saving}
                    onClick={() =>
                      handleSaveCellValue({
                        ...editingCell,
                        originalValue: cellValue ?? "",
                      })
                    }
                  >
                    Сохранить
                  </Button>
                )}
              </div>
            );
          }

          return (
            <div
              onClick={() =>
                setEditingCell({
                  rowId: record.id,
                  colId: index,
                  value: cellValue ?? "",
                })
              }
              style={{
                cursor: "pointer",
                minHeight: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cellValue == null ? "" : cellValue}
            </div>
          );
        },
      })),
    ];
  }, [datePoint, week, editingCell, saving]);

  // --- Данные таблицы ---
  const tableData = useMemo(() => {
    if (!allStatistics.length || !datePoint) return [];

    return allStatistics.map((statisticItem) => {
      const rowData = {
        id: statisticItem.id,
        name: statisticItem.name,
        key: statisticItem.id,
      };

      const weeklyData = generateWeeklyData(
        statisticItem.statisticDatas || [],
        week,
        datePoint
      );

      weeklyData.forEach((w, index) => {
        const cellObj = { value: w.value, statisticId: statisticItem.id };
        if (w._id) cellObj._id = w._id;
        rowData[`week_${index}`] = cellObj;
      });

      return rowData;
    });
  }, [allStatistics, datePoint, week]);

  // --- Инициализация даты ---
  useEffect(() => {
    const initialDate = calculateInitialDate();
    if (initialDate) setDatePoint(initialDate);
  }, []);

  // --- Загрузка статистики ---
  useEffect(() => {
    if (statistics && statistics.length > 0) {
      setAllStatistics(_.cloneDeep(statistics));
    }
  }, [statistics]);

  return (
    <div className={classes.dialog}>
      {contextHolder}
      <Headers name="сводка" />
      <div className={classes.main}>
        <Flex gap="middle" justify="center">
          {countWeeks.map((item) => (
            <Button
              key={item.value}
              type={week === item.value ? "primary" : "default"}
              onClick={() => setWeek(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Flex>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoadingGetStatistics || isFetchingGetStatistics}
          pagination={false}
          scroll={{ x: "max-content", y: "calc(100vh - 200px)" }} // подгоняем под высоту экрана
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
