import React, { useState, useEffect } from "react";
import classes from "./StatisticTable.module.css";

import {
  Button,
  Table,
  Space,
  DatePicker,
  InputNumber,
  Popover,
  Flex,
  Tooltip,
} from "antd";

import _ from "lodash";

import { DeleteOutlined, AliwangwangOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import PopoverForViewPointsOnWeek from "./PopoverForViewPointsOnWeek";
// Extend dayjs with the plugin
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;

export default function StatisticTable({
  selectedStatisticId,
  dataSource,
  setDataSource,
  createPoints,
  setCreatePoints,
  chartType,
  createCorellationPoints,
  setCreateCorellationPoints,
}) {
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
          value={text}
          onChange={(value) => {
            setCreatePoints((prevData) =>
              prevData.map((item) =>
                item.id === record.id ? { ...item, value: value } : item
              )
            );
          }}
          style={{ width: "100%" }}
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
          style={{ width: "100%" }}
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
          style={{ width: "100%" }}
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
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  const columnsDataSourceWeek = [
    {
      title: "Значение",
      dataIndex: "value",
      render: (text, record) => (
        <InputNumber
          value={text}
          disabled
          style={{ width: "100%" }}
          formatter={(value) => {
            if (value === undefined || value === null) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          }}
        />
      ),
    },

    {
      title: "Неделя",
      dataIndex: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          disabled
          format="DD.MM.YYYY" // Отображаем в удобном формате
          style={{ width: "100%" }}
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

    {
      title: "Кор.число",
      dataIndex: "correlationType",
      align: "center",
      render: (_, record) => (
        <div className={classes.container}>
          {record.correlationType ? (
            <Popover
              placement="rightBottom"
              title="Установленно коррекционное число"
              content={
                <Flex gap="small" justify="center" align="center">
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
                    style={{ width: "100%" }}
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
                  <Tooltip
                    title="удалить коррекционное число"
                    placement="right"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setDataSource((prevData) =>
                          prevData.map((item) =>
                            item.id === record.id
                              ? {
                                  ...item,
                                  value: null,
                                  correlationType: null,
                                  isChanged: true,
                                }
                              : item
                          )
                        );
                      }}
                    />
                  </Tooltip>
                </Flex>
              }
            >
              <Button type="text" icon={<AliwangwangOutlined />} />
            </Popover>
          ) : (
            <Popover
              placement="rightBottom"
              title="Коррекционное число"
              content={
                <Flex gap="small" justify="center" align="center">
                  <InputNumber
                    style={{ width: "100%" }}
                    value={
                      createCorellationPoints.find(
                        (item) => item.id === record.id
                      )?.value || null
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

                  {createCorellationPoints.find(
                    (item) => item.id === record.id
                  ) ? (
                    <Tooltip
                      title="удалить коррекционное число"
                      placement="right"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setCreateCorellationPoints((prevData) =>
                            prevData.filter((item) => item.id !== record.id)
                          );
                        }}
                      />
                    </Tooltip>
                  ) : null}
                </Flex>
              }
            >
              <Button
                style={{ width: "80px", height: "50px" }}
                type="text"
                icon={<AliwangwangOutlined style={{ color: "#8c8c8c" }} />}
                className={
                  createCorellationPoints.find((item) => item.id === record.id)
                    ? ""
                    : classes.hiddenButton
                }
              />
            </Popover>
          )}
        </div>
      ),
    },
  ];

  const columnsDataSourceMonth = [
    {
      title: "Значение",
      dataIndex: "value",
      render: (text, record) => (
        <InputNumber
          value={text}
          disabled
          style={{ width: "100%" }}
          formatter={(value) => {
            if (value === undefined || value === null) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          }}
        />
      ),
    },

    {
      title: "Месяц",
      dataIndex: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          disabled
          format="MM.YYYY" // Отображаем в удобном формате
          style={{ width: "100%" }}
        />
      ),
    },

    {
      title: "Кор.число",
      dataIndex: "correlationType",
      align: "center",
      render: (_, record) => (
        <div className={classes.container}>
          {record.correlationType ? (
            <Popover
              placement="rightBottom"
              title="Установленно коррекционное число"
              content={
                <Flex gap="small" justify="center" align="center">
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
                    style={{ width: "100%" }}
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
                  <Tooltip
                    title="удалить коррекционное число"
                    placement="right"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setDataSource((prevData) =>
                          prevData.map((item) =>
                            item.id === record.id
                              ? {
                                  ...item,
                                  value: null,
                                  correlationType: null,
                                  isChanged: true,
                                }
                              : item
                          )
                        );
                      }}
                    />
                  </Tooltip>
                </Flex>
              }
            >
              <Button
                style={{ width: "80px", height: "50px" }}
                type="text"
                icon={<AliwangwangOutlined />}
              />
            </Popover>
          ) : (
            <Popover
              placement="rightBottom"
              title="Коррекционное число"
              content={
                <Flex gap="small" justify="center" align="center">
                  <InputNumber
                    style={{ width: "100%" }}
                    value={
                      createCorellationPoints.find(
                        (item) => item.id === record.id
                      )?.value || null
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

                  {createCorellationPoints.find(
                    (item) => item.id === record.id
                  ) ? (
                    <Tooltip
                      title="удалить коррекционное число"
                      placement="right"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setCreateCorellationPoints((prevData) =>
                            prevData.filter((item) => item.id !== record.id)
                          );
                        }}
                      />
                    </Tooltip>
                  ) : null}
                </Flex>
              }
            >
              <Button
                style={{ width: "80px", height: "50px" }}
                type="text"
                icon={<AliwangwangOutlined style={{ color: "#8c8c8c" }} />}
                className={
                  createCorellationPoints.find((item) => item.id === record.id)
                    ? ""
                    : classes.hiddenButton
                }
              />
            </Popover>
          )}
        </div>
      ),
    },
  ];

  const columnsDataSourceYear = [
    {
      title: "Значение",
      dataIndex: "value",
      render: (text, record) => (
        <InputNumber
          value={text}
          disabled
          style={{ width: "100%" }}
          formatter={(value) => {
            if (value === undefined || value === null) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          }}
        />
      ),
    },

    {
      title: "Год",
      dataIndex: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          disabled
          format="YYYY" // Отображаем в удобном формате
          style={{ width: "100%" }}
        />
      ),
    },

    {
      title: "Кор.число",
      dataIndex: "correlationType",
      align: "center",
      render: (_, record) => (
        <div className={classes.container}>
          {record.correlationType ? (
            <Popover
              placement="rightBottom"
              title="Установленно коррекционное число"
              content={
                <Flex gap="small" justify="center" align="center">
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
                    style={{ width: "100%" }}
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
                  <Tooltip
                    title="удалить коррекционное число"
                    placement="right"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setDataSource((prevData) =>
                          prevData.map((item) =>
                            item.id === record.id
                              ? {
                                  ...item,
                                  value: null,
                                  correlationType: null,
                                  isChanged: true,
                                }
                              : item
                          )
                        );
                      }}
                    />
                  </Tooltip>
                </Flex>
              }
            >
              <Button type="text" icon={<AliwangwangOutlined />} />
            </Popover>
          ) : (
            <Popover
              placement="rightBottom"
              title="Коррекционное число"
              content={
                <Flex gap="small" justify="center" align="center">
                  <InputNumber
                    style={{ width: "100%" }}
                    value={
                      createCorellationPoints.find(
                        (item) => item.id === record.id
                      )?.value || null
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
                  {createCorellationPoints.find(
                    (item) => item.id === record.id
                  ) ? (
                    <Tooltip
                      title="удалить коррекционное число"
                      placement="right"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setCreateCorellationPoints((prevData) =>
                            prevData.filter((item) => item.id !== record.id)
                          );
                        }}
                      />
                    </Tooltip>
                  ) : null}
                </Flex>
              }
            >
              <Button
                style={{ width: "80px", height: "50px" }}
                type="text"
                icon={<AliwangwangOutlined style={{ color: "#8c8c8c" }} />}
                className={
                  createCorellationPoints.find((item) => item.id === record.id)
                    ? ""
                    : classes.hiddenButton
                }
              />
            </Popover>
          )}
        </div>
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

  console.log("dataSource = ", dataSource);
  return (
    <div style={{ overflowX: "hidden", marginTop: "10px" }}>
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
            value={selectedDate}
            onChange={handleDateChange}
            format="DD.MM.YYYY"
          />
        </Space>

        <Space direction="vertical" size={4}>
          <div style={{ fontWeight: 500 }}>Создать интервал точек</div>
          <RangePicker
            value={selectedRange}
            onChange={handleRangeChange}
            format="DD.MM.YYYY"
          />
        </Space>
      </Space>

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
