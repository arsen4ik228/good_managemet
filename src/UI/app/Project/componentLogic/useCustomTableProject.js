import React, { useState, useEffect, useContext, useMemo } from "react";
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

import { HolderOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

dayjs.locale("ru"); // Устанавливаем русский язык для dayjs

const RowContext = React.createContext({});
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const Row = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });
  const style = Object.assign(
    Object.assign(Object.assign({}, props.style), {
      transform: CSS.Translate.toString(transform),
      transition,
    }),
    isDragging ? { position: "relative", zIndex: 9999 } : {}
  );
  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const EditableCell = ({
  value,
  onChange,
  type = "input",
  options,
  name,
  required,
  stylesCell,
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
            {...stylesCell}
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
              {...stylesCell}
              format="DD.MM.YYYY"
              value={value ? dayjs(value) : null}
              onChange={(date) => onChange(date)}
            />
          </Form.Item>
        </ConfigProvider>
      );

    case "targetState":
      return (
        <Form.Item name={name} style={{ margin: 0 }}>
          <Select
            {...stylesCell}
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
              {...stylesCell}
              format="DD.MM.YYYY"
              value={value ? dayjs(value) : null}
              onChange={(date) => onChange(date)}
            />
          </Form.Item>
        </ConfigProvider>
      );

    default:
      return <></>;
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

export default function useCustomTableProject({
  expandedRowKeys,
  setExpandedRowKeys,
  form,
  targetStateOnProduct,

  selectedProjectId,
  disabledTable,
  tables,
  setTables,
  isLoadingGetProjectId,
  isFetchingGetProjectId,
  targets,
  posts,
  setDescriptionProduct,
  descriptionProduct,

  stylesColumnSelect,
  stylesColumnDate,
}) {
  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setTables((prevTables) => {
      return prevTables.map((table) => {
        const isTargetGroup = table.elements.some((el) => el.id === active.id);
        if (!isTargetGroup) return table;

        const activeIndex = table.elements.findIndex(
          (el) => el.id === active.id
        );
        const overIndex = table.elements.findIndex((el) => el.id === over.id);

        if (activeIndex === -1 || overIndex === -1) return table;

        return {
          ...table,
          elements: arrayMove(table.elements, activeIndex, overIndex).map(
            (el, index) => ({ ...el, orderNumber: index + 1, isUpdated: true })
          ),
        };
      });
    });
  };

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
      key: "sort",
      align: "center",
      width: 20,
      render: (text, record) => (
        <>{record.type === "Продукт" ? null : <DragHandle />}</>
      ),
    },
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
        stylesCell={stylesColumnSelect}
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
        stylesCell={stylesColumnDate}
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
            stylesCell={stylesColumnSelect}
              type="targetState"
              value={text}
              options={
                targetStateOnProduct
                  ? statusesTargetsWithoutDraft
                  : statusesTargets
              }
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
                stylesCell={stylesColumnSelect}
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
        stylesCell={stylesColumnDate}
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

  // Колонки для таблицы "Описание" (только одна колонка с текстовым полем)
  const descriptionColumns = [
    {
      title: "Описание проекта",
      dataIndex: "content",
      align: "center",
      render: (text, record) => (
        <Input.TextArea
          value={descriptionProduct}
          onChange={(e) => setDescriptionProduct(e.target.value)}
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

        // Для группы "Описание" используем специальные колонки
        const columnsToUse =
          record.groupName === "Описание" ? descriptionColumns : columns;

        return (
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={groupItems?.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                components={{ body: { row: Row } }}
                columns={columnsToUse}
                dataSource={groupItems}
                rowKey="id"
                pagination={false}
                showHeader={true}
                bordered={false}
              />
            </SortableContext>
          </DndContext>
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
      width: 70,
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
                width: "75%",
              }}
            >
              {record.groupName !== "Продукт" &&
              record.groupName !== "Описание" ? (
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
                  margin: "0 auto",
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
        {
          tableName: "Описание",
          elements: [
            {
              content: null,
            },
          ],
        },
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

  return {
    form,
    disabledTable,
    isLoadingGetProjectId,
    isFetchingGetProjectId,
    groupColumns,
    dataWithGroups,
    expandableConfig,
  };
}
