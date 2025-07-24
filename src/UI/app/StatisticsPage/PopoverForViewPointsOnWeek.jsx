import React, { useState, useEffect } from "react";

import {
  Button,
  Table,
  Space,
  DatePicker,
  InputNumber,
  Popover,
  Flex,
  Tooltip,
  message,
} from "antd";

import {
  DeleteOutlined,
  AliwangwangOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { useGetSingleStatistic, useUpdateSingleStatistic } from "@hooks";

import _ from "lodash";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// Extend dayjs with the plugin
dayjs.extend(isSameOrAfter);

export default function PopoverForViewPointsOnWeek({
  record,
  setDataSource,
  selectedStatisticId,
}) {
  const [isSaving, setIsSaving] = useState(false);

  const [datePointForViewDays, setDatePointForViewDays] = useState(null);

  const [pointsForViewDaysBD, setPointsForViewDaysBD] = useState([]);
  const [pointsForViewDaysCreate, setPointsForViewDaysCreate] = useState([]);

  // Получение статистики по id
  const {
    currentStatistic,
    statisticData: dataForViewDays,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  } = useGetSingleStatistic({
    statisticId: selectedStatisticId,

    datePoint: datePointForViewDays,

    viewType: "daily",
  });

  // Обновление статистики
  const {
    updateStatistics,
    isLoadingUpdateStatisticMutation,
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    ErrorUpdateStatisticMutation,
    localIsResponseUpdateStatisticsMutation,
  } = useUpdateSingleStatistic();

  const columnspointsForViewDaysCreate = [
    {
      title: "Значение",
      dataIndex: "value",
      key: "value",
      render: (text, record) => (
        <InputNumber
          value={text}
          onChange={(value) => {
            setPointsForViewDaysCreate((prevData) =>
              prevData.map((item) =>
                item.id === record.id
                  ? {
                      ...item,
                      isChanged: true,
                      value: value !== null ? value : 0,
                    }
                  : item
              )
            );
          }}
          style={{ width: "100%" }}
          min={undefined}
          step={0.01}
          decimalSeparator="."
          formatter={(value) => {
            if (value === undefined || value === null) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }}
          parser={(value) => {
            if (value === undefined || value === null) return null;
            return parseFloat(value.replace(/(,*)/g, "")) || 0;
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
          disabled
          format="DD.MM.YYYY" // Отображаем в удобном формате
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  const columnsDataSourceDaily = [
    {
      dataIndex: "value",
      key: "value",
      render: (text, record) => (
        <InputNumber
          value={text}
          onChange={(value) => {
            setPointsForViewDaysBD((prevData) =>
              prevData.map((item) =>
                item.id === record.id
                  ? {
                      ...item,
                      isChanged: true,
                      value: value !== null ? value : 0,
                    }
                  : item
              )
            );
          }}
          style={{ width: "100%" }}
          min={undefined}
          step={1}
          decimalSeparator="."
          formatter={(value) => {
            if (value === undefined || value === null) return "";
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }}
          parser={(value) => {
            if (value === undefined || value === null) return null;
            return parseFloat(value.replace(/(,*)/g, "")) || 0;
          }}
        />
      ),
    },

    {
      dataIndex: "valueDate",
      key: "valueDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null} // Парсим ISO строку
          disabled
          format="DD.MM.YYYY" // Отображаем в удобном формате
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  const countDays = () => {
    setPointsForViewDaysCreate([]);

    const baseId = Date.now();
    const startDate = dayjs(datePointForViewDays).startOf("day");

    console.log("startDate", startDate);

    // Создаем Set для быстрого поиска существующих дат
    const existingDates = new Set(
      dataForViewDays
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
        const date = startDate.subtract(i, "day").startOf("day");
        if (!date || !date.isValid?.()) {
          // Проверка валидности
          console.error("Некорректная дата на шаге", i, date);
          return null;
        }
        return {
          id: baseId + i,
          value: 0,
          valueDate: `${date.format("YYYY-MM-DD")}T00:00:00.000Z`,
          dateStr: date.format("YYYY-MM-DD"),
        };
      })
      .filter(Boolean) // Удаляем возможные null
      .filter((item) => !existingDates.has(item.dateStr))
      .map(({ dateStr, ...rest }) => rest)
      .sort((a, b) => new Date(a.valueDate) - new Date(b.valueDate));

    setPointsForViewDaysCreate([...newData]);
  };

  const handleSave = async () => {
    try {
      const DataArray = {};

      const statisticDataCreateDtos = pointsForViewDaysCreate.filter(
        (item) => item.isChanged === true
      );

      if (statisticDataCreateDtos.length > 0) {
        DataArray.statisticDataCreateDtos = statisticDataCreateDtos.map(
          ({ id, isChanged, ...rest }) => ({ ...rest })
        );
      }

      const statisticDataUpdateDtos = pointsForViewDaysBD.filter(
        (item) => item.isChanged === true
      );

      if (statisticDataUpdateDtos.length > 0) {
        DataArray.statisticDataUpdateDtos = statisticDataUpdateDtos.map(
          ({ id, value, correlationType, ...rest }) => ({
            _id: id,
            value,
          })
        );
      }

      setIsSaving(true);

      await updateStatistics({
        statisticId: currentStatistic?.id,
        _id: currentStatistic?.id,
        ...DataArray,
      }).unwrap();

      message.success("Данные успешно обновлены!");
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error("Ошибка при обновлении.");
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPointsForViewDaysBD(_.cloneDeep(dataForViewDays));
    countDays();
  };

  useEffect(() => {
    if (!dataForViewDays) return;

    if (datePointForViewDays) {
      setPointsForViewDaysBD(_.cloneDeep(dataForViewDays));
      countDays();
    }
  }, [dataForViewDays, datePointForViewDays]);

  return (
    <Popover
      placement="rightBottom"
      title="Дни недели"
      trigger="click"
      open={record.isViewDays}
      onOpenChange={() =>
        setDataSource((prev) =>
          prev.map((item) =>
            item.id === record.id
              ? { ...item, isViewDays: !item.isViewDays }
              : item
          )
        )
      }
      content={
        <>
          <Table
            columns={columnspointsForViewDaysCreate}
            dataSource={pointsForViewDaysCreate}
            pagination={false}
            size="small"
            rowKey="id"
            loading={isFetchingGetStatisticId}
          />

          <Table
            columns={columnsDataSourceDaily}
            dataSource={pointsForViewDaysBD}
            pagination={false}
            size="small"
            rowKey="id"
            loading={isFetchingGetStatisticId}
          />
          <Flex justify="flex-end" gap="middle" style={{ marginTop: "10px" }}>
            <Button type="primary" onClick={handleSave} loading={isSaving}>
              Сохранить
            </Button>
            <Button onClick={handleReset}>Отменить</Button>
          </Flex>
        </>
      }
    >
      <Button
        type="text"
        icon={record.isViewDays ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={() => setDatePointForViewDays(record.dateForViewDaysInWeek)}
      />
    </Popover>
  );
}
