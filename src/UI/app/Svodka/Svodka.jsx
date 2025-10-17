import React, { useState, useEffect, useMemo } from "react";
import classes from "./Svodka.module.css";
import Header from "@Custom/Header/Header";
import {
  useAllStatistics,
  useModuleActions,
  useUpdateSvodka,
} from "@hooks";
import { Table, Flex, Button, InputNumber, message, Spin, ConfigProvider } from "antd";
import _ from "lodash";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const countWeeks = [
  { label: "квартал", value: "13" },
  { label: "полгода", value: "26" },
  { label: "год", value: "52" },
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
    const endDate = dayjs(baseDate).day(reportDay).subtract(i, "week").endOf("day");
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

    const weekTotalPoint = weekPoints.find((p) => p.correlationType === "Неделя");

    if (weekTotalPoint) {
      const parsed = parseFloat(weekTotalPoint.value);
      week.value = isNaN(parsed) ? null : parsed;
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

  return weeksArray.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate));
};

const formatNumber = (num) => {
  if (num === 0 || num === "0") return "0";
  if (num === null || num === undefined || num === "") return "";
  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// --- Компонент ---
export default function Svodka() {
  const [allStatistics, setAllStatistics] = useState([]);
  const [datePoint, setDatePoint] = useState(null);
  const [week, setWeek] = useState("13");
  const [editingCell, setEditingCell] = useState(null);

  const [saveQueue, setSaveQueue] = useState([]); // очередь сохранений
  const [savingIds, setSavingIds] = useState([]); // для индикатора спиннера
  const [isProcessingQueue, setIsProcessingQueue] = useState(false); // флаг обработки очереди

  const { isChange_svodka } = useModuleActions("statistic");
  const { statistics, isLoadingGetStatistics, isFetchingGetStatistics } = useAllStatistics({ statisticData: true, isActive: true });
  const { updateSvodka } = useUpdateSvodka();
  const [messageApi, contextHolder] = message.useMessage();

  // --- Обработка очереди ---
  useEffect(() => {
    if (saveQueue.length > 0 && !isProcessingQueue) {
      processQueue();
    }
  }, [saveQueue, isProcessingQueue]);

  const processQueue = async () => {
    if (!saveQueue.length) return;
    setIsProcessingQueue(true);

    const [next, ...rest] = saveQueue;
    setSaveQueue(rest);

    const { rowId, colId, value, originalValue } = next;
    if (value === originalValue) {
      setIsProcessingQueue(false);
      return;
    }

    setSavingIds((prev) => [...prev, `${rowId}_${colId}`]);

    try {
      const weeklyData = generateWeeklyData(
        allStatistics.find((item) => item.id === rowId)?.statisticDatas || [],
        week,
        datePoint
      );
      const cell = weeklyData[colId];
      const valueDate = dayjs(cell.valueDate).toISOString();

      let response;
      if (cell._id) {
        response = await updateSvodka({
          statisticId: rowId,
          _id: rowId,
          statisticDataUpdateDtos: [{ _id: cell._id, value: value === "" ? null : value, correlationType: "Неделя" }],
        }).unwrap();
      } else {
        response = await updateSvodka({
          statisticId: rowId,
          _id: rowId,
          statisticDataCreateDtos: [{ valueDate, value: value === "" ? null : value, correlationType: "Неделя" }],
        }).unwrap();
      }

      const createdId = response?.createdPointId;

      setAllStatistics((prev) =>
        prev.map((item) => {
          if (item.id !== rowId) return item;
          const statisticDatas = _.cloneDeep(item.statisticDatas) || [];
          if (cell._id) {
            const existingPoint = statisticDatas.find((p) => p.id === cell._id);
            if (existingPoint) existingPoint.value = value === "" ? null : value;
          } else {
            statisticDatas.push({
              id: createdId,
              value: value === "" ? null : value,
              correlationType: "Неделя",
              valueDate,
            });
          }
          return { ...item, statisticDatas };
        })
      );
    } catch (err) {
      console.error("Ошибка при обновлении статистики:", err);
      messageApi.error("Ошибка при сохранении");
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== `${rowId}_${colId}`));
      setIsProcessingQueue(false);
    }
  };

  const queueSaveCellValue = ({ rowId, colId, value, originalValue }) => {
    setSaveQueue((prev) => [...prev, { rowId, colId, value, originalValue }]);
  };

  // --- Навигация по ячейкам ---
  const moveToCell = (rowId, colId, direction) => {
    const rowIndex = tableData.findIndex((r) => r.id === rowId);
    if (rowIndex === -1) return;

    let newRow = rowIndex;
    let newCol = colId;

    if (direction === "right") newCol += 1;
    if (direction === "left") newCol -= 1;
    if (direction === "down") newRow += 1;
    if (direction === "up") newRow -= 1;

    if (newRow < 0 || newRow >= tableData.length) return;
    if (newCol < 0 || newCol >= week) return;

    const newRowId = tableData[newRow].id;
    setEditingCell({
      rowId: newRowId,
      colId: newCol,
      value: tableData[newRow][`week_${newCol}`]?.value ?? "",
    });
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
        title: <div style={{ textAlign: "center", fontWeight: "bold" }}>{w.date}</div>,
        dataIndex: `week_${index}`,
        key: `week_${index}`,
        width: 160,
        align: "center",
        render: (cellData, record) => {
          const cellValue = cellData?.value ?? null;
          const isEditing = editingCell?.rowId === record.id && editingCell?.colId === index;
          const isCellSaving = savingIds.includes(`${record.id}_${index}`);

          const saveAndMove = (direction) => {
            queueSaveCellValue({
              ...editingCell,
              originalValue: cellValue ?? "",
            });
            moveToCell(record.id, index, direction);
          };

          if (isEditing) {
            return (
              <Spin spinning={isCellSaving}>
                <InputNumber
                  controls={false}
                  autoFocus
                  value={editingCell.value ?? null}
                  style={{ width: "100%" }}
                  decimalSeparator="."
                  onChange={(newVal) =>
                    setEditingCell((prev) => ({ ...prev, value: newVal ?? "" }))
                  }
                  onBlur={() => {
                    queueSaveCellValue({
                      ...editingCell,
                      originalValue: cellValue ?? "",
                    });
                    setEditingCell(null);
                  }}
                  onKeyDown={(e) => {
                    const keyMap = { Enter: "down", Tab: "right", ArrowRight: "right", ArrowLeft: "left", ArrowUp: "up", ArrowDown: "down" };
                    const shiftKeyMap = { Enter: "up", Tab: "left" };
                    const direction = e.shiftKey ? shiftKeyMap[e.key] : keyMap[e.key];
                    if (direction) {
                      e.preventDefault();
                      saveAndMove(direction);
                    }
                  }}
                />
              </Spin>
            );
          }

          return (
            <div
              onClick={() =>
                setEditingCell({ rowId: record.id, colId: index, value: cellValue ?? "" })
              }
              style={{
                width: "100%",
                height: "100%",
                minHeight: "32px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isEditing ? "#e6f7ff" : "transparent",
              }}
            >
              {isCellSaving ? <Spin size="small" /> : formatNumber(cellValue)}
            </div>
          );
        },
      })),
    ];
  }, [datePoint, week, editingCell, savingIds]);

  // --- Данные таблицы ---
  const tableData = useMemo(() => {
    if (!allStatistics.length || !datePoint) return [];

    return allStatistics.map((statisticItem) => {
      const rowData = { id: statisticItem.id, name: statisticItem.name, key: statisticItem.id };
      const weeklyData = generateWeeklyData(statisticItem.statisticDatas || [], week, datePoint);

      weeklyData.forEach((w, index) => {
        rowData[`week_${index}`] = { value: w.value, statisticId: statisticItem.id };
        if (w._id) rowData[`week_${index}`]._id = w._id;
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
      <Header name="сводка">
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
      </Header>
      <div className={classes.main}>
        <ConfigProvider componentDisabled={!isChange_svodka}>
          <Table
            columns={columns}
            dataSource={tableData}
            bordered
            loading={isLoadingGetStatistics || isFetchingGetStatistics}
            pagination={false}
            scroll={{ x: "max-content", y: "calc(100vh - 170px)" }}
            style={{ width: "100%", height: "100%" }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
