import React, { useState, useEffect, useRef } from "react";

import {
  Button,
  Table,
  Space,
  DatePicker,
  InputNumber,
  Flex,
} from "antd";

import _ from "lodash";

import { DeleteOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import PopoverForViewPointsOnWeek from "./PopoverForViewPointsOnWeek";
// Extend dayjs with the plugin
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;

export default function StatisticTable({
  selectedStatisticId,
  isActive,
  dataSource,
  setDataSource,
  createPoints,
  setCreatePoints,
  chartType,
  createCorellationPoints,
  setCreateCorellationPoints,
}) {
  const [editingRow, setEditingRow] = useState(null);
  const inputRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const handleDateChange = (date) => {
    if (date) {
      const dateWithoutTZ = dayjs(date).startOf("day");
      const newData = {
        id: Date.now(),
        value: null,
        valueDate: `${dateWithoutTZ.format("YYYY-MM-DD")}T00:00:00.000Z`,
        correlationType: null,
      };

      setCreatePoints((prev) => {
        const isDateExists = prev.some((item) => {
          const itemDate = dayjs(item.valueDate).startOf("day");
          return itemDate.isSame(dateWithoutTZ, "day");
        });

        if (isDateExists) return prev;

        return [...prev, newData].sort(
          (a, b) => new Date(a.valueDate) - new Date(b.valueDate)
        );
      });
    }
    setSelectedDate(null);
  };

  const handleRangeChange = (dates) => {
    if (!dates || !dates[0] || !dates[1]) {
      setSelectedRange(null);
      return;
    }

    // Блокируем повторные вызовы
    if (
      selectedRange &&
      dates[0].isSame(selectedRange[0], "day") &&
      dates[1].isSame(selectedRange[1], "day")
    ) {
      return;
    }

    const daysDiff = dates[1].diff(dates[0], "day");
    const baseId = Date.now();

    const newData = Array(daysDiff + 1)
      .fill()
      .map((_, i) => {
        const date = dates[0].clone().add(i, "day").startOf("day");
        return {
          id: `${baseId}-${i}`,
          value: null,
          valueDate: `${date.format("YYYY-MM-DD")}T00:00:00.000Z`,
          dateStr: date.format("YYYY-MM-DD"), // Для проверки дубликатов
          correlationType: null,
        };
      });

    setCreatePoints((prev) => {
      const existingDates = new Set(
        prev.map((item) =>
          dayjs(item.valueDate).startOf("day").format("YYYY-MM-DD")
        )
      );

      return [
        ...prev,
        ...newData
          .filter((item) => !existingDates.has(item.dateStr))
          .map(({ dateStr, ...rest }) => rest),
      ].sort((a, b) => new Date(a.valueDate) - new Date(b.valueDate));
    });

    setSelectedRange(dates);
  };

  const handleDelete = (id) => {
    setCreatePoints(createPoints.filter((item) => item.id !== id));
  };

  const columnsCreatePoints = [
    {
      title: "Значение",
      dataIndex: "value",
      key: "value",
      render: (text, record) => (
        <InputNumber
          controls={false}
          value={text}
          onChange={(value) => {
            setCreatePoints((prevData) =>
              prevData.map((item) =>
                item.id === record.id ? { ...item, value: value } : item
              )
            );
          }}
          style={{ width: "130px" }}
          min={undefined}
          decimalSeparator="."
          formatter={(value) => {
            if (value === undefined || value === null) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          }}
          parser={(value) => {
            if (value == null || value === "") return null;

            const cleanValue = value.toString().replace(/[\s,]/g, "");
            if (cleanValue === "") return null;

            const numericValue = parseFloat(cleanValue);
            return isNaN(numericValue) ? null : numericValue;
          }}
        />
      ),
    },

    {
      title: "Дата",
      dataIndex: "valueDate",
      key: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          onChange={(date, dateString) => {
            setCreatePoints((prevData) =>
              prevData.map((item) =>
                item.id === record.id
                  ? {
                    ...item,
                    valueDate: date ? date.toISOString() : null, // Сохраняем как ISO
                  }
                  : item
              )
            );
          }}
          format="DD.MM.YYYY" // Отображаем в удобном формате
          style={{ width: "150px" }}
        />
      ),
    },

    {
      title: "Удалить",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  const columnsDataSourceDaily = [
    {
      title: "Значение",
      dataIndex: "value",
      key: "value",
      render: (text, record) => (
        <InputNumber
          controls={false}
          value={text}
          onChange={(value) => {
            setDataSource((prevData) =>
              prevData.map((item) =>
                item.id === record.id
                  ? {
                    ...item,
                    value: value,
                    ...(value !== record.value ? { isChanged: true } : {}),
                  }
                  : item
              )
            );
          }}
          style={{ width: "130px" }}
          min={undefined}
          decimalSeparator="."
          formatter={(value) => {
            if (value === undefined || value === null) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          }}
          parser={(value) => {
            if (value == null || value === "") return null;

            const cleanValue = value.toString().replace(/[\s,]/g, "");
            if (cleanValue === "") return null;

            const numericValue = parseFloat(cleanValue);
            return isNaN(numericValue) ? null : numericValue;
          }}
        />
      ),
    },

    {
      title: "Дата",
      dataIndex: "valueDate",
      key: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          onChange={(date, dateString) => {
            setDataSource((prevData) =>
              prevData.map((item) =>
                item.id === record.id
                  ? {
                    ...item,
                    valueDate: date ? date.toISOString() : null, // Сохраняем как ISO
                  }
                  : item
              )
            );
          }}
          format="DD.MM.YYYY" // Отображаем в удобном формате
          style={{ width: "150px" }}
        />
      ),
    },
  ];

  const columnsDataSourceWeek = [
    {
      title: "Значение",
      dataIndex: "value",
      render: (text, record) => {
        const isEditing = editingRow === record.id;

        return isEditing ? (

          <Flex gap="small" justify="center" align="center" ref={inputRef}>

            {record.correlationType ? (
              <InputNumber
                value={record.value}
                onChange={(value) => {
                  setDataSource((prevData) =>
                    prevData.map((item) =>
                      item.id === record.id
                        ? {
                          ...item,
                          value: value,
                          ...(value !== record.value
                            ? { isChanged: true }
                            : {}),
                        }
                        : item
                    )
                  );

                }}
                controls={false}
                style={{ width: "130px" }}
                min={undefined}
                decimalSeparator="."
                formatter={(value) => {
                  if (value === undefined || value === null) return "";
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }}
                parser={(value) => {
                  if (value == null || value === "") return null;

                  const cleanValue = value.toString().replace(/[\s,]/g, "");
                  if (cleanValue === "") return null;

                  const numericValue = parseFloat(cleanValue);
                  return isNaN(numericValue) ? null : numericValue;
                }}
              />) : (
              <InputNumber
                controls={false}
                style={{ width: "130px" }}
                value={
                  createCorellationPoints.find(
                    (item) => item.id === record.id
                  )?.value || record.value
                }
                onChange={(value) => {
                  setCreateCorellationPoints((prevData) => {
                    const exists = prevData.some(
                      (item) => item.id === record.id
                    );
                    if (exists) {
                      return prevData.map((item) =>
                        item.id === record.id
                          ? {
                            ...item,
                            value: value,
                          }
                          : item
                      );
                    }
                    return [
                      ...prevData,
                      {
                        id: record.id,
                        value: value,
                        valueDate: record.valueDateForCreate,
                        correlationType: "Неделя",
                      },
                    ];
                  });

                }}
                min={undefined}
                precision={2}
                decimalSeparator="."
                formatter={(value) => {
                  if (value === undefined || value === null) return "";
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }}
                parser={(value) => {
                  if (value == null || value === "") return null;

                  const cleanValue = value.toString().replace(/[\s,]/g, "");
                  if (cleanValue === "") return null;

                  const numericValue = parseFloat(cleanValue);
                  return isNaN(numericValue) ? null : numericValue;
                }}
              />
            )
            }

          </Flex>

        ) : (
          <div
            onDoubleClick={() => setEditingRow(record.id)}
            style={{ cursor: "pointer", width: "130px", height: "32px" }}

          >
            {(() => {
              const point = createCorellationPoints.find((item) => item.id === record.id);

              const val = point ? point.value : record.value;

              return val !== null && val !== undefined && val !== ""
                ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                : "";
            })()}

          </div>
        );
      },
    },

    {
      title: "Неделя",
      dataIndex: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          disabled
          format="DD.MM.YYYY" // Отображаем в удобном формате
          style={{ width: "150px" }}
        />
      ),
    },

    {
      title: "Дни",
      dataIndex: "information",
      render: (text, record) => (
        <PopoverForViewPointsOnWeek
          record={record}
          setDataSource={setDataSource}
          selectedStatisticId={selectedStatisticId}
        />
      ),
    },


  ];

  const columnsDataSourceMonth = [
    {
      title: "Значение",
      dataIndex: "value",
      render: (text, record) => {
        const isEditing = editingRow === record.id;

        return isEditing ? (

          <Flex gap="small" justify="center" align="center" ref={inputRef}>

            {record.correlationType ? (
              <InputNumber
                controls={false}
                value={record.value}
                onChange={(value) => {
                  setDataSource((prevData) =>
                    prevData.map((item) =>
                      item.id === record.id
                        ? {
                          ...item,
                          value: value,
                          ...(value !== record.value
                            ? { isChanged: true }
                            : {}),
                        }
                        : item
                    )
                  );

                }}
                style={{ width: "130px" }}
                min={undefined}
                decimalSeparator="."
                formatter={(value) => {
                  if (value === undefined || value === null) return "";
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }}
                parser={(value) => {
                  if (value == null || value === "") return null;

                  const cleanValue = value.toString().replace(/[\s,]/g, "");
                  if (cleanValue === "") return null;

                  const numericValue = parseFloat(cleanValue);
                  return isNaN(numericValue) ? null : numericValue;
                }}
              />) : (
              <InputNumber
                controls={false}
                style={{ width: "130px" }}
                value={
                  createCorellationPoints.find(
                    (item) => item.id === record.id
                  )?.value || record.value
                }
                onChange={(value) => {
                  setCreateCorellationPoints((prevData) => {
                    const exists = prevData.some(
                      (item) => item.id === record.id
                    );
                    if (exists) {
                      return prevData.map((item) =>
                        item.id === record.id
                          ? {
                            ...item,
                            value: value,
                          }
                          : item
                      );
                    }
                    return [
                      ...prevData,
                      {
                        id: record.id,
                        value: value,
                        valueDate: record.valueDateForCreate,
                        correlationType: "Месяц",
                      },
                    ];
                  });

                }}
                min={undefined}
                precision={2}
                decimalSeparator="."
                formatter={(value) => {
                  if (value === undefined || value === null) return "";
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }}
                parser={(value) => {
                  if (value == null || value === "") return null;

                  const cleanValue = value.toString().replace(/[\s,]/g, "");
                  if (cleanValue === "") return null;

                  const numericValue = parseFloat(cleanValue);
                  return isNaN(numericValue) ? null : numericValue;
                }}
              />
            )
            }

          </Flex>

        ) : (
          <div
            onDoubleClick={() => setEditingRow(record.id)}
            style={{ cursor: "pointer", width: "130px", height: "32px" }}
          >
            {(() => {
              const point = createCorellationPoints.find((item) => item.id === record.id);

              const val = point ? point.value : record.value;

              return val !== null && val !== undefined && val !== ""
                ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                : "";
            })()}

          </div>
        );
      },
    },

    {
      title: "Месяц",
      dataIndex: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          disabled
          format="MM.YYYY" // Отображаем в удобном формате
          style={{ width: "150px" }}
        />
      ),
    },


  ];

  const columnsDataSourceYear = [
    {
      title: "Значение",
      dataIndex: "value",
      render: (text, record) => {

        const isEditing = editingRow === record.id;

        return isEditing ? (
          <Flex gap="small" justify="center" align="center" ref={inputRef}>
            {record.correlationType ? (
              <InputNumber
                controls={false}
                value={record.value}
                onChange={(value) => {
                  setDataSource((prevData) =>
                    prevData.map((item) =>
                      item.id === record.id
                        ? {
                          ...item,
                          value: value,
                          ...(value !== record.value
                            ? { isChanged: true }
                            : {}),
                        }
                        : item
                    )
                  );

                }}
                style={{ width: "130px" }}
                min={undefined}
                decimalSeparator="."
                formatter={(value) => {
                  if (value === undefined || value === null) return "";
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }}
                parser={(value) => {
                  if (value == null || value === "") return null;

                  const cleanValue = value.toString().replace(/[\s,]/g, "");
                  if (cleanValue === "") return null;

                  const numericValue = parseFloat(cleanValue);
                  return isNaN(numericValue) ? null : numericValue;
                }}
              />) : (
              <InputNumber
                controls={false}
                style={{ width: "130px" }}
                value={
                  createCorellationPoints.find(
                    (item) => item.id === record.id
                  )?.value || record.value
                }
                onChange={(value) => {
                  setCreateCorellationPoints((prevData) => {

                    const exists = prevData.some(
                      (item) => item.id === record.id
                    );

                    if (exists) {
                      return prevData.map((item) =>
                        item.id === record.id
                          ? {
                            ...item,
                            value: value,
                          }
                          : item
                      );
                    }
                    return [
                      ...prevData,
                      {
                        id: record.id,
                        value: value,
                        valueDate: record.valueDateForCreate,
                        correlationType: "Год",
                      },
                    ];
                  });

                }}
                min={undefined}
                precision={2}
                decimalSeparator="."
                formatter={(value) => {
                  if (value === undefined || value === null) return "";
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }}
                parser={(value) => {
                  if (value == null || value === "") return null;

                  const cleanValue = value.toString().replace(/[\s,]/g, "");
                  if (cleanValue === "") return null;

                  const numericValue = parseFloat(cleanValue);
                  return isNaN(numericValue) ? null : numericValue;
                }}
              />
            )
            }
          </Flex>
        ) : (
          <div
            onDoubleClick={() => setEditingRow(record.id)}
            style={{ cursor: "pointer", width: "130px", height: "32px" }}
          >
            {(() => {
              const point = createCorellationPoints.find((item) => item.id === record.id);

              const val = point ? point.value : record.value;

              return val !== null && val !== undefined && val !== ""
                ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                : "";
            })()}

          </div>

        );
      },
    },

    {
      title: "Год",
      dataIndex: "valueDate",
      render: (text) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          disabled
          format="YYYY"
          style={{ width: "150px" }}
        />
      ),
    },
  ];

  const getColumnsByChartType = (type) => {
    switch (type) {
      case "daily":
        return columnsDataSourceDaily;
      case "monthly":
        return columnsDataSourceMonth;
      case "yearly":
        return columnsDataSourceYear;
      case "thirteen":
        return columnsDataSourceWeek;
      case "twenty_six":
        return columnsDataSourceWeek;
      case "fifty_two":
        return columnsDataSourceWeek;
      default:
        return columnsDataSourceDaily; // или любой другой вариант по умолчанию
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setEditingRow(null);
      }
    }

    if (editingRow !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingRow]);

  return (
    <div style={{
      overflowX: "hidden",
      height: "100%",
      backgroundColor: "#fff",
      border: "1px solid #CCCCCC",
      borderRadius: "5px",
    }}>

      {isActive && (
        <Space
          size="large"
          align="center"
          style={{
            marginBottom: 16,
            width: "100%",
            justifyContent: "center", // Добавлено для центрирования
          }}
        >
          <Space direction="vertical" size={4}>
            <div style={{ fontWeight: 500 }}>Создать точку</div>
            <DatePicker
              style={{ width: "150px" }}
              value={selectedDate}
              onChange={handleDateChange}
              format="DD.MM.YYYY"
            />
          </Space>

          <Space direction="vertical" size={4}>
            <div style={{ fontWeight: 500 }}>Создать интервал точек</div>
            <RangePicker
              style={{ width: "150px" }}
              value={selectedRange}
              onChange={handleRangeChange}
              format="DD.MM.YYYY"
            />
          </Space>
        </Space>
      )}

      {createPoints?.length > 0 ? (
        <Table
          columns={columnsCreatePoints}
          dataSource={createPoints}
          pagination={false}
          size="small"
          rowKey="id"
        />
      ) : null}

      {dataSource?.length > 0 ? (
        <Table
          columns={getColumnsByChartType(chartType)}
          dataSource={dataSource}
          pagination={false}
          size="small"
          rowKey="id"
        />
      ) : null}
    </div>
  );
}
