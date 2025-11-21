import React, { useState, useEffect, useRef } from "react";

import {
  Table,
  Input,
  InputNumber,
  Flex,
} from "antd";

import _ from "lodash";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// Extend dayjs with the plugin
dayjs.extend(isSameOrAfter);


export default function StatisticTable({
  datePoint,
  dataSource,
  setDataSource,
  chartType,
  createCorellationPoints,
  setCreateCorellationPoints,
}) {
  //("dataSource = ", dataSource);
  const startDate = dayjs(datePoint).subtract(6, "day").format("DD.MM.YYYY");
  const endDate = dayjs(datePoint).format("DD.MM.YYYY");

  const [editingRow, setEditingRow] = useState(null);
  const inputRef = useRef(null);


  const columnsDataSourceDaily = [
    {
      title: "Дата",
      dataIndex: "valueDate",
      key: "valueDate",
      render: (text) => (
        <Input
          value={text ? dayjs(text).format("DD.MM.YYYY") : ""}
          readOnly
          style={{ width: "150px" }}
        />
      ),
    },

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
  ];

  const columnsDataSourceWeek = [
    {
      title: "Неделя",
      dataIndex: "valueDate",
      align: "center",
      render: (text) => (
        <Input
          value={text ? dayjs(text).format("DD.MM.YYYY") : ""}
          readOnly
          style={{ width: "150px" }}
        />
      ),
    },

    {
      title: "Значение",
      dataIndex: "value",
      align: "center",
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
                value={(() => {
                  const foundItem = createCorellationPoints.find(item => item.id === record.id);
                  return foundItem ? foundItem.value : record.value;
                })()}
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
            onClick={() => setEditingRow(record.id)}
            style={{
              cursor: "pointer",

              width: "130px",
              height: "32px",

              border: "1px solid #d9d9d9",
              borderRadius: "6px",

              padding: "4px 11px",

              fontSize: "16px",
              textAlign: "left"
            }}
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
  ];

  const columnsDataSourceMonth = [
    {
      title: "Месяц",
      dataIndex: "valueDate",
      align: "center",
      render: (text) => (
        <Input
          value={text ? dayjs(text).format("MM.YYYY") : ""}
          readOnly
          style={{ width: "150px" }}
        />
      ),
    },

    {
      title: "Значение",
      dataIndex: "value",
      align: "center",
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
                value={(() => {
                  const foundItem = createCorellationPoints.find(item => item.id === record.id);
                  return foundItem ? foundItem.value : record.value;
                })()}
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
            onClick={() => setEditingRow(record.id)}
            style={{
              cursor: "pointer",
              width: "130px",
              height: "32px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              padding: "4px 11px",
              fontSize: "16px",
              textAlign: "left"
            }}
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

  ];

  const columnsDataSourceYear = [
    {
      title: "Год",
      dataIndex: "valueDate",
      align: "center",
      render: (text) => (
        <Input
          value={text ? dayjs(text).format("YYYY") : ""}
          readOnly
          style={{ width: "150px" }}
        />
      ),
    },

    {
      title: "Значение",
      dataIndex: "value",
      align: "center",
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
                value={(() => {
                  const foundItem = createCorellationPoints.find(item => item.id === record.id);
                  return foundItem ? foundItem.value : record.value;
                })()}
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
            onClick={() => setEditingRow(record.id)}
            style={{
              cursor: "pointer",
              width: "130px",
              height: "32px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              padding: "4px 11px",
              fontSize: "16px",
              textAlign: "left"
            }}
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

      display: "flex",
      flexDirection: "column",
      rowGap: "5px"
    }}>

      {
        chartType === "daily" ? (

          <>

            <div style={{
              width: "100%",
              height: "50px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              rowGap: "5px",

              backgroundColor: "rgba(207, 222, 229, 0.5)",
              border: "1px solid #CCCCCC",
              borderRadius: "5px 5px 0 0",

              padding: "5px",

            }}>
              <div style={{
                color: "black",
                fontWeight: "600"
              }}>НЕДЕЛЯ</div>
              <div> с {startDate} по {endDate}</div>
            </div>

            {dataSource?.length > 0 ? (

              <div style={{
                maxWidth: "330px",
                minHeight: "calc(100% - 55px)",
                backgroundColor: "#fff",
                border: "1px solid #CCCCCC",
                borderRadius: "5px",
                overflowY: "auto",
              }}>
                <Table
                  columns={getColumnsByChartType(chartType)}
                  dataSource={dataSource}
                  pagination={false}
                  size="small"
                  rowKey="id"
                  showHeader={chartType === "daily" ? false : true}
                  sticky
                />
              </div>
            ) : null}
          </>

        ) : (
          <>
            {dataSource?.length > 0 ? (

              <div style={{
                maxWidth: "330px",
                minHeight: "100%",
                backgroundColor: "#fff",
                border: "1px solid #CCCCCC",
                borderRadius: "5px",
                overflowY: "auto",
              }}>
                <Table
                  columns={getColumnsByChartType(chartType)}
                  dataSource={dataSource}
                  pagination={false}
                  size="small"
                  rowKey="id"
                  showHeader={chartType === "daily" ? false : true}
                  sticky
                />
              </div>
            ) : null}
          </>
        )
      }
    </div>
  );
}
