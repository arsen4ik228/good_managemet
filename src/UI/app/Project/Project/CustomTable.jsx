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

const EditableCell = ({ value, onChange, type = "input", options }) => {
  const handleChange = (newValue) => {
    onChange(newValue);
  };

  switch (type) {
    case "select":
      return (
        <Select
          value={value}
          onChange={handleChange}
          options={options}
          style={{ width: "100%" }}
        />
      );
    case "date":
      return (
        <ConfigProvider locale={ruRU}>
          <DatePicker
            format="DD.MM.YYYY"
            value={dayjs(value)}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </ConfigProvider>
      );
    default:
      return (
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          style={{ width: "100%" }}
        />
      );
  }
};

const statusesTargets = [
  { label: "Активная", value: "Активная" },
  { label: "Завершена", value: "Завершена" },
  { label: "Отменена", value: "Отменена" },
];

export default function CustomTable({
  selectedProjectId,
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
      orderNumber:
        tables.find((item) => item.tableName === groupName).elements.length + 1,
      content: "",
      holderPostId: "",
      dateStart: dayjs().format("DD.MM.YYYY"),
      deadline: dayjs().format("DD.MM.YYYY"),
      type: groupName,
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
            return { ...el, [property]: newValue };
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
      onCell: () => ({
        style: { width: "50vw" },
      }),
      render: (text, record) => (
        <EditableCell
          type="input"
          value={text}
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
      render: (text, record) => (
        <EditableCell
          type="select"
          value={text}
          options={posts?.map((item) => ({
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
      render: (text, record) => (
        <EditableCell
          type="date"
          value={text}
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
      render: (text, record) => (
        <EditableCell
          type="select"
          value={text}
          options={statusesTargets}
          onChange={(newValue) => {
            const tableIndex = tables.findIndex((t) =>
              t.elements.some((el) => el.id === record.id)
            );
            handleCellChange(tableIndex, record.id, newValue, "targetState");
          }}
        />
      ),
    },
    {
      title: "Дата начала",
      dataIndex: "dateStart",
      width: 180, // Фиксированная ширина
      align: "center",
      render: (text, record) => (
        <EditableCell
          type="date"
          value={text}
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
    // Отключаем стандартное раскрытие
    expandRowByClick: true,

    // Рендер дочерних элементов (реальные данные группы)
    expandedRowRender: (record) => {
      if (record.__isGroup) {
        const groupItems =
          tables.find((t) => t.tableName === record.groupName)?.elements || [];

        return (
          <Table
            columns={columns.map((col) => ({
              ...col,
            }))}
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

    // Управление раскрытыми группами
    rowExpandable: (record) => record.__isGroup,

    // Показываем стрелки только для групп
    expandIconColumnIndex: 0,
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
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {record.groupName !== "Продукт" ? (
                <Button
                  icon={
                    <img
                      src={addCircleGrey}
                      alt="add"
                      style={{ width: 20, height: 20 }}
                    />
                  }
                  onClick={(event) => handleAddRow(event, record.groupName)}
                />
              ) : null}

              {record.groupName}
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
        createTableData("Обычная"),
        createTableData("Организационные мероприятия"),
        createTableData("Правила"),
        createTableData("Статистика"),
      ]);
    }
  }, [selectedProjectId, targets]);

  return (
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
  );
}
