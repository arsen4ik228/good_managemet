import React, { useState, useEffect } from "react";
import { baseUrl } from "@helpers/constants";
import addCircleGrey from "@image/addCircleGrey.svg";
import {
  DatePicker,
  Input,
  Select,
  Table,
  ConfigProvider,
  Avatar,
  Button,
  Form,
} from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { createStyles } from "antd-style";

import ruRU from "antd/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru"); // Устанавливаем русский язык для dayjs

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const EditableCell = ({
  value,
  onChange,
  type = "input",
  options,
  name,
  required,
}) => {
  const rules = required
    ? [{ required: true, message: "Заполните поле" }]
    : undefined;

  switch (type) {
    case "content":
      return (
        <Form.Item name={name} rules={rules} style={{ margin: 0 }}>
          <Input
            allowClear
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "100%" }}
          />
        </Form.Item>
      );

    case "holderPostId":
      return (
        <Form.Item name={name} rules={rules} style={{ margin: 0 }}>
          <Select
            style={{ width: "100%" }}
            allowClear
            showSearch
            optionFilterProp="searchLabel"
            filterOption={(input, option) =>
              option?.searchLabel.toLowerCase().includes(input.toLowerCase())
            }
            options={options}
            value={value}
            onChange={onChange}
          />
        </Form.Item>
      );

    case "deadline":
      return (
        <ConfigProvider locale={ruRU}>
          <Form.Item name={name} rules={rules} style={{ margin: 0 }}>
            <DatePicker
              format="DD.MM.YYYY"
              value={value ? dayjs(value) : null}
              onChange={(date) => onChange(date)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </ConfigProvider>
      );

    case "targetState":
      return (
        <Form.Item name={name} style={{ margin: 0 }}>
          <Select
            style={{ width: "100%" }}
            options={options}
            value={value}
            onChange={onChange}
          />
        </Form.Item>
      );

    case "dateStart":
      return (
        <ConfigProvider locale={ruRU}>
          <Form.Item name={name} style={{ margin: 0 }}>
            <DatePicker
              format="DD.MM.YYYY"
              value={value ? dayjs(value) : null}
              onChange={(date) => onChange(date)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </ConfigProvider>
      );

    default:
      return (
        <></>
      );
  }
};

const statusesTargets = [
  { label: "Активная", value: "Активная" },
  { label: "Завершена", value: "Завершена" },
  { label: "Отменена", value: "Отменена" },
  { label: "Черновик", value: "Черновик" },
];

const statusesTargetsWithoutDraft = [
  { label: "Активная", value: "Активная" },
  { label: "Завершена", value: "Завершена" },
  { label: "Отменена", value: "Отменена" },
];

export default function CustomTableProject({
  expandedRowKeys,
  setExpandedRowKeys,
  form,
  targetStateOnProduct,
  setTargetStateOnProduct,

  selectedProjectId,
  disabledTable,
  tables,
  setTables,
  isLoadingGetProjectId,
  isFetchingGetProjectId,
  targets,
  posts,
}) {
  const { styles } = useStyle();

  // Добавление новой строки в таблицу
  const handleAddRow = (event, groupName) => {
    event.stopPropagation();
    console.log("tables", tables);
    console.log("groupName", groupName);

    const newRow = {
      id: uuidv4(),
      isCreated: true,
      type: groupName,
      orderNumber:
        tables.find((item) => item.tableName === groupName).elements.length + 1,
      content: null,
      holderPostId: null,
      targetState: targetStateOnProduct ? "Активная" : null,
      dateStart: null,
      deadline: null,
    };

    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.tableName !== groupName) return table;
        return {
          ...table,
          elements: [...table.elements, newRow],
        };
      })
    );
  };

  // Удаление строки из таблицы
  const handleDeleteRow = (recordId, groupName) => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.tableName !== groupName) return table;
        return {
          ...table,
          elements: table.elements.filter((el) => el.id !== recordId),
        };
      })
    );
  };

  // Обработчик изменений в ячейках таблицы
  const handleCellChange = (tableIndex, recordId, newValue, property) => {
    setTables((prevTables) =>
      prevTables.map((table, idx) => {
        if (idx !== tableIndex) return table;

        return {
          ...table,
          elements: table.elements.map((el) => {
            if (el.id !== recordId) return el;

            // Создаем обновленный элемент
            const updatedElement = {
              ...el,
              [property]: newValue,
            };

            // Если элемент не создан, добавляем флаг isUpdated
            if (!el.isCreated) {
              updatedElement.isUpdated = true;
            }

            return updatedElement;
          }),
        };
      })
    );
  };

  // Колонки таблицы
  const columns = [
    {
      title: "№",
      dataIndex: "orderNumber",
      fixed: "left",
      align: "center",
      render: (text, record) => (
        <>
          <span>{text}</span>
          {record?.isCreated ? (
            <Button
              style={{ marginLeft: "10px" }}
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteRow(record.id, record.type)}
            />
          ) : null}
        </>
      ),
    },
    {
      title: "Описание",
      dataIndex: "content",
      align: "center",
      onCell: (record) => ({
        "data-row-key": record.id,
        "data-field": `holderPostId-${record.id}`,
        style: { width: "50vw" },
      }),
      render: (text, record) => (
        <EditableCell
          type="content"
          value={text}
          name={`content-${record.id}`}
          required={targetStateOnProduct}
          onChange={(newValue) => {
            const tableIndex = tables.findIndex((t) =>
              t.elements.some((el) => el.id === record.id)
            );
            handleCellChange(tableIndex, record.id, newValue, "content");
          }}
        />
      ),
    },
    {
      title: "Ответственный",
      dataIndex: "holderPostId",
      width: 150, // Фиксированная ширина
      align: "center",
      onCell: (record) => ({
        "data-row-key": record.id,
        "data-field": `holderPostId-${record.id}`,
      }),
      render: (text, record) => (
        <EditableCell
          type="holderPostId"
          value={text}
          name={`holderPostId-${record.id}`}
          required={targetStateOnProduct}
          options={posts?.map((item) => ({
            searchLabel: item?.postName,
            label: (
              <>
                <Avatar
                  src={baseUrl + item?.user?.avatar_url}
                  icon={!item?.user?.avatar_url ? <UserOutlined /> : undefined}
                />
                <span>{item?.postName}</span>
              </>
            ),
            value: item?.id,
          }))}
          onChange={(newValue) => {
            const tableIndex = tables.findIndex((t) =>
              t.elements.some((el) => el.id === record.id)
            );
            handleCellChange(tableIndex, record.id, newValue, "holderPostId");
          }}
        />
      ),
    },
    {
      title: "Дата конца",
      dataIndex: "deadline",
      width: 180, // Фиксированная ширина
      align: "center",
      onCell: (record) => ({
        "data-row-key": record.id,
        "data-field": `deadline-${record.id}`,
      }),
      render: (text, record) => (
        <EditableCell
          type="deadline"
          value={text}
          name={`deadline-${record.id}`}
          required={targetStateOnProduct}
          onChange={(newDate) => {
            const tableIndex = tables.findIndex((t) =>
              t.elements.some((el) => el.id === record.id)
            );
            handleCellChange(tableIndex, record.id, newDate, "deadline");
          }}
        />
      ),
    },
    {
      title: "Статус",
      dataIndex: "targetState",
      width: 100, // Фиксированная ширина
      align: "center",
      onCell: (record) => ({
        "data-row-key": record.id,
        "data-field": `targetState-${record.id}`,
      }),
      render: (text, record) => (
        <>
          {record.type === "Продукт" ? (
            <EditableCell
              type="targetState"
              value={text}
              options={targetStateOnProduct ? statusesTargetsWithoutDraft : statusesTargets}
              name={`targetState-${record.id}`}
              required={targetStateOnProduct}
              onChange={(newValue) => {
                const tableIndex = tables.findIndex((t) =>
                  t.elements.some((el) => el.id === record.id)
                );
                handleCellChange(
                  tableIndex,
                  record.id,
                  newValue,
                  "targetState"
                );
              }}
            />
          ) : (
            <>
              {targetStateOnProduct ? (
                <EditableCell
                  type="targetState"
                  value={text}
                  options={statusesTargetsWithoutDraft}
                  name={`targetState-${record.id}`}
                  onChange={(newValue) => {
                    const tableIndex = tables.findIndex((t) =>
                      t.elements.some((el) => el.id === record.id)
                    );
                    handleCellChange(
                      tableIndex,
                      record.id,
                      newValue,
                      "targetState"
                    );
                  }}
                />
              ) : (
                <>-----------</>
              )}
            </>
          )}
        </>
      ),
    },
    {
      title: "Дата начала",
      dataIndex: "dateStart",
      width: 180, // Фиксированная ширина
      align: "center",
      onCell: (record) => ({
        "data-row-key": record.id,
        "data-field": `dateStart-${record.id}`,
      }),
      render: (text, record) => (
        <EditableCell
          type="dateStart"
          value={text}
          name={`dateStart-${record.id}`}
          required={targetStateOnProduct}
          onChange={(newDate) => {
            const tableIndex = tables.findIndex((t) =>
              t.elements.some((el) => el.id === record.id)
            );
            handleCellChange(tableIndex, record.id, newDate, "dateStart");
          }}
        />
      ),
    },
  ];

  // 1. Настройка expandable для группировки
  const expandableConfig = {
    expandRowByClick: true,
    expandedRowKeys,
    expandIconColumnIndex: 0,
    onExpandedRowsChange: (keys) => {
      if (keys !== expandedRowKeys) {
        setExpandedRowKeys(keys);
      }
    },
    expandedRowRender: (record) => {
      if (record.__isGroup) {
        const groupItems =
          tables.find((t) => t.tableName === record.groupName)?.elements || [];

        return (
          <Table
            columns={columns}
            dataSource={groupItems}
            rowKey="id"
            pagination={false}
            showHeader={true}
            bordered={false}
          />
        );
      }
      return null;
    },
    rowExpandable: (record) => record.__isGroup,
  };

  // 2. Формируем данные с группами
  const dataWithGroups = React.useMemo(() => {
    return tables?.map((table) => ({
      key: `group-${table.tableName}`,
      id: `group-${table.tableName}`,
      __isGroup: true,
      groupName: table.tableName,
      elementCount: table.elements.length,
    }));
  }, [tables]);

  // 3. Модифицированные колонки для отображения групп
  const groupColumns = [
    {
      title: "Кол-во",
      dataIndex: "elementCount",
      width: 100,
      align: "center",
      render: (_, record) => {
        if (record.__isGroup) {
          return (
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              {record.elementCount}
            </span>
          );
        }
        return _;
      },
    },
    {
      title: "Группа",
      dataIndex: "groupName",
      align: "center",
      render: (_, record) => {
        if (record.__isGroup) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              {record.groupName !== "Продукт" ? (
                <Button
                  style={{
                    marginRight: "auto",
                  }}
                  icon={
                    <img
                      src={addCircleGrey}
                      alt="add"
                      style={{ width: 20, height: 20 }}
                    />
                  }
                  onClick={(event) => handleAddRow(event, record.groupName)}
                />
              ) : (
                <Button
                  style={{
                    marginRight: "auto",
                    visibility: "hidden",
                  }}
                  icon={
                    <img
                      src={addCircleGrey}
                      alt="add"
                      style={{ width: 20, height: 20 }}
                    />
                  }
                />
              )}
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  margin: "0 auto", // Центрирует текст
                }}
              >
                {record.groupName}
              </span>
            </div>
          );
        }
        return _;
      },
    },
  ];

  useEffect(() => {
    if (selectedProjectId && targets) {
      const createTableData = (type) => ({
        tableName: type,
        elements: targets
          .filter((item) => item.type === type)
          .map((item) => ({ ...item })) // Создаем копии объектов
          .sort((a, b) => a.orderNumber - b.orderNumber),
      });

      setTables([
        createTableData("Продукт"),
        createTableData("Задача"),
        createTableData("Организационные мероприятия"),
        createTableData("Правила"),
        createTableData("Метрика"),
      ]);
    }
  }, [selectedProjectId, targets]);

  useEffect(() => {
    if (tables && tables.length > 0) {
      const formValues = {};
      tables.forEach((table) => {
        table.elements.forEach((element) => {
          formValues[`content-${element.id}`] = element.content;
          formValues[`holderPostId-${element.id}`] = element.holderPostId;
          formValues[`deadline-${element.id}`] = element.deadline
            ? dayjs(element.deadline)
            : null;
          formValues[`targetState-${element.id}`] = element.targetState;
          formValues[`dateStart-${element.id}`] = element.dateStart
            ? dayjs(element.dateStart)
            : null;
        });
      });
      form.setFieldsValue(formValues);
    }
  }, [tables, form]);

  useEffect(() => {
    const isProductActive = tables
      ?.find((table) => table.tableName === "Продукт")
      ?.elements.some((el) => el.targetState === "Активная");

    if (targetStateOnProduct !== isProductActive) {
      setTargetStateOnProduct(isProductActive);
    }
  }, [tables]);

  return (
    <Form form={form} disabled={disabledTable}>
      <Table
        bordered
        className={styles.customTable}
        loading={isLoadingGetProjectId || isFetchingGetProjectId}
        columns={groupColumns}
        dataSource={dataWithGroups}
        rowKey="key"
        pagination={false}
        scroll={{ x: "max-content", y: "67vh" }}
        style={{ width: "100%" }}
        expandable={expandableConfig}
      />
    </Form>
  );
}
