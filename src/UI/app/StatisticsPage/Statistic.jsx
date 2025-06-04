import React, { useState, useEffect, useRef } from "react";
import classes from "./Statistic.module.css";

import Graphic from "@Custom/Graphic.jsx";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import statisticsArrowLeft from "@image/statisticsArrowLeft.svg";
import statisticsArrowRight from "@image/statisticsArrowRight.svg";
import trash from "@image/trash.svg";
import addBlock from "@image/iconAdd.svg";
import hint from "@image/hint.svg";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import exit from "@image/exitModal.svg";
import WaveLetters from "@Custom/WaveLetters.jsx";
import getDateFormatSatatistic from "@Custom/Function/getDateFormatStatistic.js";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import Select from "@Custom/Select/Select";
import Input from "@Custom/Input/Input";
import Lupa from "@Custom/Lupa/Lupa";
import { ModalSelectRadio } from "@Custom/modalSelectRadio/ModalSelectRadio";
import { useModalSelectRadio } from "@hooks";
import { useStatisticsHook } from "@hooks";
import { usePostsHook } from "@hooks";
import { useOrganizationHook } from "@hooks";

import _ from "lodash";

import { ConfigProvider, Tour } from "antd";
import ruRU from "antd/locale/ru_RU";

export default function Statistic() {
  const [colorFirstPoint, setColorFirstPoint] = useState();
  // Организация
  const {
    reduxSelectedOrganizationId,
    reduxSelectedOrganizationReportDay,

    currentOrganization,
    isLoadingOrganizationId,
    isFetchingOrganizationId,

    updateOrganization,
    isLoadingUpdateOrganizationMutation,
    isSuccessUpdateOrganizationMutation,
    isErrorUpdateOrganizationMutation,
    ErrorOrganization,
    localIsResponseUpdateOrganizationMutation,
  } = useOrganizationHook();

  const [openModalForCreated, setOpenModalForCreated] = useState(false);

  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [statisticId, setStatisticId] = useState("");

  const [name, setName] = useState();
  const [type, setType] = useState();
  const [postId, setPostId] = useState();

  const [description, setDescription] = useState("");

  const [receivedPoints, setReceivedPoints] = useState([]);
  const [oldReceivedPoints, setOldReceivedPoints] = useState([]);
  const [createPoints, setCreatePoints] = useState([]);

  const [reportDay, setReportDay] = useState(
    reduxSelectedOrganizationReportDay
  );

  useEffect(() => {
    if (
      reduxSelectedOrganizationReportDay !== undefined &&
      reduxSelectedOrganizationReportDay !== null
    ) {
      setReportDay(reduxSelectedOrganizationReportDay);
    }
  }, [reduxSelectedOrganizationReportDay]);

  const [typeGraphic, setTypeGraphic] = useState("Ежедневный");
  const [disabledPoints, setDisabledPoints] = useState(false);

  const [arrayPoints, setArrayPoints] = useState([]);
  const [showPoints, setShowPoints] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [count, setCount] = useState(0);

  const [openModalReportDay, setOpenModalReportDay] = useState(false);
  const [showReportDay, setShowReportDay] = useState();
  const [showReportDayComes, setShowReportDayComes] = useState();

  const [showCorrelationPoint, setShowCorrelationPoint] = useState([]);

  const refDay = useRef(null);
  const refName = useRef(null);
  const refArrowLeft = useRef(null);
  const refArrowRight = useRef(null);
  const refLupa = useRef(null);
  const refType = useRef(null);
  const refPost = useRef(null);
  const refTypeGraphic = useRef(null);
  const refDescription = useRef(null);
  const refCreate = useRef(null);
  const refUpdate = useRef(null);
  const refAddPoint = useRef(null);
  const refDeletePoint = useRef(null);

  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Отчетный день",
      description:
        "Выберите и поменяйте отчетный день (Отчетный день поменяется у всей организации)",
      target: () => refDay.current, // Добавляем проверку
    },

    {
      title: "Создать",
      description: "Нажмите для создания статистики",
      target: () => refCreate.current,
    },
    {
      title: "Сохранить",
      description: "Нажмите для сохранения статистики",
      target: () => refUpdate.current,
    },

    {
      title: "Назад",
      description: "Нажмите для смещения графика назад",
      target: () => refArrowLeft.current,
      disabled: !statisticId,
    },
    {
      title: "Вперед",
      description: "Нажмите для смещения графика вперед",
      target: () => refArrowRight.current,
      disabled: !statisticId,
    },

    {
      title: "Создание точки",
      description: "Нажмите для добавления точки на график",
      target: () => refAddPoint.current,
      disabled: !statisticId,
    },
    {
      title: "Удаление точки",
      description: "Нажмите для удаления только что созданной точки",
      target: () => refDeletePoint.current,
      disabled: !statisticId,
    },

    {
      title: "Название статистики",
      description: "Здесь можно поменять название выбранной статистики",
      target: () => refName.current, // Добавляем проверку
    },
    {
      title: "Выбрать статистику",
      description: "Нажмите и выберите пост",
      target: () => refLupa.current, // Добавляем проверку
    },
    {
      title: "Тип статистики",
      description: "Здесь можно поменять тип статистики",
      target: () => (statisticId ? refType.current : null), // Добавляем проверку
      disabled: !statisticId,
    },
    {
      title: "Пост",
      description: "Здесь можно поменять пост у статистики",
      target: () => (statisticId ? refPost.current : null), // Добавляем проверку
      disabled: !statisticId,
    },
    {
      title: "График",
      description: "Здесь можно поменять тип отображаемого графика",
      target: () => (statisticId ? refTypeGraphic.current : null), // Добавляем проверку
      disabled: !statisticId,
    },
    {
      title: "Описание",
      description: "Описание графика",
      target: () => (statisticId ? refDescription.current : null), // Добавляем проверку
      disabled: !statisticId,
    },
  ].filter((step) => !step.disabled);

  const {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,

    currentStatistic,
    statisticDatas,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,

    updateStatistics,
    isLoadingUpdateStatisticMutation,
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    ErrorUpdateStatisticMutation,
    localIsResponseUpdateStatisticsMutation,

    postStatistics,
    isLoadingPostStatisticMutation,
    isSuccessPostStatisticMutation,
    isErrorPostStatisticMutation,
    ErrorPostStatisticMutation,
    localIsResponsePostStatisticsMutation,
  } = useStatisticsHook({
    statisticData: false,
    statisticId: statisticId,
  });

  // Получение постов
  const { allPosts, isLoadingGetPosts, isErrorGetPosts } = usePostsHook();

  // Создание статистики
  const {
    selectedID: selectedPostIdForCreated,

    handleRadioChange,
    handleInputChangeModalSearch,

    filterArraySearchModal,
    inputSearchModal,
  } = useModalSelectRadio({ array: allPosts, arrayItem: "postName" });

  const functionOpenModalForCreated = () => {
    setOpenModalForCreated(true);
  };

  const createStatistics = async () => {
    await postStatistics({
      name: "Статистика",
      postId: selectedPostIdForCreated,
    })
      .unwrap()
      .then((result) => {
        setStatisticId(result.id);
        setOpenModalForCreated(false);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  // Все для начальной страницы
  const addPoint = () => {
    setCreatePoints((prevState) => [
      { valueDate: "", value: 0, id: new Date() },
      ...prevState,
    ]);
  };

  const deletePoint = () => {
    setCreatePoints((prevState) => prevState.slice(0, -1));
  };

  const onChangePoints = (nameArrray, value, type, index, id) => {
    if (nameArrray === "received") {
      const updatedPoints = [...receivedPoints];
      if (type === "value") {
        updatedPoints[index][type] = Number(value);
      } else {
        updatedPoints[index][type] =  Number(value);
      }
      setReceivedPoints(updatedPoints);
    } else {
      setCreatePoints((prevState) => {
        const updatedPoints = prevState.map((item) => {
          if (item.id === id) {
            return type === "value"
              ? { ...item, value: Number(value) }
              : { ...item, valueDate: value };
          }
          return item;
        });

        updatedPoints.sort(
          (a, b) => Date.parse(b.valueDate) - Date.parse(a.valueDate)
        );
        return updatedPoints;
      });
    }
  };

  function compareArrays(oldArray, newArray) {
    const changes = [];
    newArray.forEach((newItem) => {
      const oldItem = oldArray.find((item) => item.id === newItem.id);

      if (oldItem) {
        const itemChanges = {};

        ["value", "valueDate"].forEach((key) => {
          if (newItem[key] !== oldItem[key]) {
            if (key == "valueDate") {
              itemChanges[key] = new Date(newItem[key]);
            } else {
              itemChanges[key] = newItem[key];
            }
          }
        });

        if (Object.keys(itemChanges).length > 0) {
          changes.push({ _id: newItem.id, ...itemChanges });
        }
      }
    });

    return changes;
  }

  const saveUpdateStatistics = async () => {
    const Data = {};

    if (Object.keys(currentStatistic).length == 0) return;

    if (type !== currentStatistic?.type) {
      Data.type = type;
    }
    if (name !== currentStatistic?.name) {
      Data.name = name;
    }
    if (postId !== currentStatistic?.post?.id) {
      Data.postId = postId;
    }
    if (description !== currentStatistic?.description) {
      Data.description = description;
    }
    if (createPoints.length > 0) {
      const array = createPoints.filter((item) => item.value !== "");
      if (array.length > 0) {
        const formatDate = array.map((item) => {
          return {
            value: item.value,
            valueDate: new Date(item.valueDate),
          };
        });
        Data.statisticDataCreateDtos = formatDate;
      }
    }
    if (receivedPoints.length > 0) {
      const array = compareArrays(oldReceivedPoints, receivedPoints);
      if (array.length > 0) {
        Data.statisticDataUpdateDtos = [];
        Data.statisticDataUpdateDtos.push(...array);
      }
    }
    if (Object.keys(Data).length > 0) {
      await updateStatistics({
        statisticId,
        _id: statisticId,
        ...Data,
      })
        .unwrap()
        .then(() => {
          if (Data.name) {
            // refetch();
          }

          setOpenModalReportDay(false);
        })
        .catch((error) => {
          console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
        });
    }
  };

  useEffect(() => {
    if (typeGraphic !== "Ежедневный") {
      setDisabledPoints(true);
    } else {
      setDisabledPoints(false);
    }
  }, [typeGraphic]);

  useEffect(() => {
    if (currentStatistic?.name) {
      setName(currentStatistic.name);
    }

    if (currentStatistic?.type) {
      setType(currentStatistic.type);
    }

    if (currentStatistic?.description) {
      setDescription(currentStatistic.description);
    }

    if (currentStatistic?.post?.id) {
      setPostId(currentStatistic.post.id);
    }
  }, [currentStatistic.id]);

  const countMonthsForGraphicYear = () => {
    const monthlyData = statisticDatas.reduce((acc, item) => {
      const itemDate = new Date(item.valueDate);
      const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
      if (
        !isNaN(itemDate) &&
        item?.correlationType !== "Год" &&
        new Date(
          new Date().setFullYear(new Date().getFullYear() - 12 + count)
        ) < itemDate
      ) {
        if (item?.correlationType === "Месяц") {
          acc[monthKey] = {
            id: item.id,
            valueSum: Number(item.value),
            year: itemDate.getFullYear(),
            month: itemDate.getMonth() + 1,
            correlationType: "Месяц",
          };
        }

        if (!acc[monthKey]) {
          acc[monthKey] = {
            valueSum: Number(0),
            year: itemDate.getFullYear(),
            month: itemDate.getMonth() + 1,
          };
        }

        if (!acc[monthKey]?.correlationType) {
          acc[monthKey].valueSum += Number(item.value);
        }
      }
      return acc;
    }, {});

    const monthlyArray = Object.keys(monthlyData).map((monthKey) => {
      const { id, valueSum, year, month, correlationType } =
        monthlyData[monthKey];

      const lastDayOfMonth = new Date(year, month, 0);
      const date = lastDayOfMonth.getDate();

      return {
        id: id || null,
        valueDate: `${year}-${month}-${date}`,
        value: Number(valueSum),
        correlationType: correlationType,
      };
    });

    return monthlyArray;
  };

  useEffect(() => {
    if (!statisticDatas.length) return;

    setReceivedPoints([]);
    setCreatePoints([]);
    setOldReceivedPoints([]);
    setArrayPoints([]);
    setShowPoints([]);
    setCount(0);
    setShowCorrelationPoint([]);

    if (typeGraphic === "Ежедневный") {
      const dayNow = new Date();

      const currentWeekday = dayNow.getDay(); // Текущий день недели (0 - Воскресенье, 1 - Понедельник и т.д.)

      // Определяем начальную дату - ближайший предыдущий день `day`
      const startDate = new Date(dayNow);
      let dayDifference;

      if (currentWeekday >= reportDay) {
        dayDifference = currentWeekday - reportDay;
      } else {
        dayDifference = 7 - (reportDay - currentWeekday);
      }

      startDate.setDate(dayNow.getDate() - dayDifference);

      // Вычисляем конечную дату (b = startDate + 7 дней)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);

      // Генерируем массив всех дат в диапазоне [startDate, endDate)
      const allDates = [];
      for (
        let date = new Date(startDate);
        date < endDate;
        date.setDate(date.getDate() + 1)
      ) {
        allDates.push(new Date(date).toISOString().split("T")[0]);
      }

      // Фильтруем данные и заполняем пропущенные даты
      const filteredData = statisticDatas
        ?.filter((item) => {
          // Проверяем, если valueDate существует и валиден
          const itemDate = item?.valueDate ? new Date(item.valueDate) : null;

          // Если itemDate не валидная, пропускаем элемент
          if (isNaN(itemDate?.getTime())) {
            return false; // Пропускаем невалидные даты
          }

          // Проверяем, если startDate и endDate валидные
          const isValidStartDate =
            startDate instanceof Date && !isNaN(startDate.getTime());
          const isValidEndDate =
            endDate instanceof Date && !isNaN(endDate.getTime());

          if (!isValidStartDate || !isValidEndDate) {
            return false; // Пропускаем, если startDate или endDate невалидны
          }

          const itemDateStr = itemDate.toISOString().split("T")[0];
          const startDateStr = startDate.toISOString().split("T")[0];
          const endDateStr = endDate.toISOString().split("T")[0];

          // Возвращаем результат фильтрации
          return (
            startDateStr <= itemDateStr &&
            itemDateStr < endDateStr &&
            item.correlationType === null
          );
        })
        ?.map((item) => ({
          ...item,
          valueDate: item.valueDate?.split("T")[0], // Предполагаем, что valueDate - строка с датой
        }));

      const updatedPoints = [];
      const _updatedPoints = [];
      const _createdPoints = [];

      allDates.forEach((date) => {
        const existingPoint = filteredData.find(
          (item) => item.valueDate === date
        );

        if (existingPoint) {
          updatedPoints.push(existingPoint);
          _updatedPoints.push({ ...existingPoint });
        } else {
          _createdPoints.push({
            id: date,
            valueDate: date,
            value: "",
          });
        }
      });

      // Сортируем данные по убыванию даты
      updatedPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );
      _updatedPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );
      _createdPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      // Устанавливаем данные
      setOldReceivedPoints(_updatedPoints);
      setReceivedPoints(updatedPoints);
      setCreatePoints(_createdPoints);

      functionForColorFirstPoint(startDate);
    }

    if (typeGraphic === "Ежемесячный") {
      const arrayPointsCorrelationTypeisMonth = statisticDatas.filter(
        (item) => item.correlationType === "Месяц"
      );
      setShowCorrelationPoint(arrayPointsCorrelationTypeisMonth);

      // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
      const monthlyData = statisticDatas.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
        if (
          !isNaN(itemDate) &&
          item?.correlationType !== "Год" &&
          new Date(new Date().setMonth(new Date().getMonth() - 13)) < itemDate
        ) {
          if (item?.correlationType === "Месяц") {
            acc[monthKey] = {
              id: item.id,
              valueSum: Number(item.value),
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
              correlationType: "Месяц",
            };
          }

          if (!acc[monthKey]) {
            acc[monthKey] = {
              valueSum: Number(0),
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
            };
          }

          if (!acc[monthKey]?.correlationType) {
            acc[monthKey].valueSum += Number(item.value);
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (последний день месяца)
      const updatedMonthlyPoints = [];

      // Для каждого месяца от 14 месяцев назад до текущего добавляем данные
      for (let i = 0; i < 13; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthKey = `${monthDate.getFullYear()}-${
          monthDate.getMonth() + 1
        }`;

        // Если данных нет для этого месяца, создаем запись с суммой 0
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            valueSum: Number(0),
            year: monthDate.getFullYear(),
            month: monthDate.getMonth() + 1,
          };
        }

        const lastDayOfMonth = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          0
        ); // Получаем последний день месяца
        const year = lastDayOfMonth.getFullYear();
        const monthValue = lastDayOfMonth.getMonth() + 1; // Месяцы начинаются с 0
        const date = lastDayOfMonth.getDate(); // Дата

        updatedMonthlyPoints.push({
          id: monthlyData[monthKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${year}-${monthValue}-${date}`,
          value: monthlyData[monthKey].valueSum, // Сумма за месяц
          ...(monthlyData[monthKey].correlationType
            ? { correlationType: monthlyData[monthKey].correlationType }
            : {}),
        });
      }

      // Сортируем данные по дате, от последнего месяца к первому
      updatedMonthlyPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setReceivedPoints(updatedMonthlyPoints);

      functionForColorFirstPoint();
    }

    if (typeGraphic === "Ежегодовой") {
      const arrayPointsCorrelationTypeisYear = statisticDatas.filter(
        (item) => item.correlationType === "Год"
      );
      setShowCorrelationPoint(arrayPointsCorrelationTypeisYear);

      const dataMonth = countMonthsForGraphicYear();
      const dataWithCorrelationTypeYear = statisticDatas?.filter(
        (item) =>
          item.correlationType === "Год" &&
          new Date().getFullYear() - 12 < new Date(item.valueDate).getFullYear()
      );

      const prepareData = dataMonth.reduce((acc, month) => {
        const date = new Date(month.valueDate);
        const yearKey = `${date.getFullYear()}`;

        const elementWithSameYear = dataWithCorrelationTypeYear.find(
          (el) => new Date(el.valueDate).getFullYear() === date.getFullYear()
        );

        if (elementWithSameYear && !acc[yearKey]) {
          acc[yearKey] = {
            id: month.id,
            valueSum: Number(elementWithSameYear.value),
            correlationType: elementWithSameYear.correlationType,
          };
          return acc;
        }

        if (!acc[yearKey]) {
          // Если года ещё нет в объекте, создаём новую запись
          acc[yearKey] = {
            valueSum: Number(0),
            year: date.getFullYear(),
          };
        }

        // Если у года нет свойства correlationType, добавляем значение к valueSum
        if (!acc[yearKey]?.correlationType) {
          acc[yearKey].valueSum += Number(month.value);
        }

        return acc;
      }, {});

      const objectdataWithCorrelationTypeYear =
        dataWithCorrelationTypeYear.reduce((acc, item) => {
          const itemDate = new Date(item.valueDate);
          const yearKey = `${itemDate.getFullYear()}`;
          if (
            new Date(new Date().setFullYear(new Date().getFullYear() - 12)) <
            itemDate
          ) {
            if (!acc[yearKey]) {
              acc[yearKey] = {
                id: item.id,
                valueSum: Number(item.value),
                correlationType: item.correlationType,
              };
            }
          }

          return acc;
        }, {});

      const prepareObjectData = _.merge(
        {},
        prepareData,
        objectdataWithCorrelationTypeYear
      );

      const updatedYearPoints = [];

      // Для каждого года от 13 лет назад до текущего добавляем данные
      for (let i = 0; i < 12; i++) {
        const yearDate = new Date();
        yearDate.setFullYear(yearDate.getFullYear() - i);
        const yearKey = `${yearDate.getFullYear()}`;

        if (!prepareObjectData[yearKey]) {
          prepareObjectData[yearKey] = {
            valueSum: Number(0),
            year: yearDate.getFullYear(),
          };
        }

        updatedYearPoints.push({
          id: prepareObjectData[yearKey]?.id || null,
          valueDate: `${yearDate.getFullYear()}-01-01`,
          value: prepareObjectData[yearKey].valueSum,
          ...(prepareObjectData[yearKey].correlationType
            ? { correlationType: prepareObjectData[yearKey].correlationType }
            : {}),
        });
      }
      updatedYearPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );
      setReceivedPoints(updatedYearPoints);
      functionForColorFirstPoint();
    }

    if (typeGraphic === "13" || typeGraphic === "26" || typeGraphic === "52") {
      const today = new Date();
      const end = new Date(today);
      const start = new Date();
      start.setDate(today.getDate() - (Number(typeGraphic) + 1) * 7);

      const selectedDayOfWeek = parseInt(reportDay);
      if (isNaN(selectedDayOfWeek)) {
        throw new Error("selectedDayOfWeek должен быть числом.");
      }

      const result = [];
      let currentDate = new Date(start);

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        const currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            const isValid =
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.correlationType === null;

            if (isValid) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return isValid;
          })
          .reduce((sum, item) => Number(sum) + Number(item.value), 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) =>
              item.myID
                ? { ...item }
                : { ...item, myID: valueDate.toISOString().split("T")[0] }
            )
          );

          result.push({
            value: Number(currentSum),
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
  }, [
    currentStatistic.id,
    isLoadingGetStatisticId,
    isFetchingGetStatisticId,
    typeGraphic,
  ]);

  // Все для модального окна при нажатии на блок координат точек для статистики
  const exitModal = () => {
    setShowPoints([]);
    setActiveIndex(null);
    setOpenModal(false);
  };

  const showCurrentPoint = (id) => {
    setOpenModal(true);

    const end = new Date(id);
    let start = new Date(id);

    if (typeGraphic === "Ежемесячный") {
      const elementcorrelationType = showCorrelationPoint.filter(
        (item) => new Date(item.valueDate).toDateString() === end.toDateString()
      );
      if (elementcorrelationType.length > 0) {
        setShowPoints(elementcorrelationType);
      } else {
        setShowPoints((prevState) => [
          ...prevState,
          { valueDate: end, value: "" },
        ]);
      }
    }

    if (typeGraphic === "Ежегодовой") {
      const elementcorrelationType = showCorrelationPoint.filter(
        (item) => new Date(item.valueDate).toDateString() === end.toDateString()
      );
      if (elementcorrelationType.length > 0) {
        setShowPoints(elementcorrelationType);
      } else {
        setShowPoints((prevState) => [
          ...prevState,
          { valueDate: end, value: "" },
        ]);
      }
    }

    if (typeGraphic !== "Ежемесячный" && typeGraphic !== "Ежегодовой") {
      start.setDate(end.getDate() - 7); //Вот тут происходит вычисление количества дат в модальном окне
      const array = arrayPoints
        .filter((item) => item.myID === id)
        .sort((a, b) => new Date(a.valueDate) - new Date(b.valueDate));

      const arrayNew = [];

      if (array.length < 7) {
        // Проходим по всем датам от start до end
        while (start < end) {
          // Ищем элемент, соответствующий текущей дате start
          const foundItem = array.find(
            (item) =>
              new Date(item.valueDate).toDateString() === start.toDateString()
          );

          if (foundItem) {
            // Если нашли, добавляем его в arrayNew
            arrayNew.push(foundItem);
          } else {
            // Если не нашли, добавляем объект с нулевым значением
            arrayNew.push({
              valueDate: start.toISOString(), // Для сохранения даты в правильном формате
              value: "",
            });
          }

          // Переходим к следующему дню
          start.setDate(start.getDate() + 1);
        }
        setShowPoints(arrayNew);
      } else {
        setShowPoints(array);
      }
    }
  };

  const updateModalPoint = (value, index) => {
    if (index < 0 || index >= showPoints.length) return;

    const update = showPoints.map((item) => ({
      ...item,
    }));

    update[index] = {
      ...update[index],
      value: value === null ? "" : Number(value),

      ...(typeGraphic === "Ежегодовой" ? { correlationType: "Год" } : {}),
      ...(typeGraphic === "Ежемесячный" ? { correlationType: "Месяц" } : {}),
    };

    setShowPoints(update);
  };

  const saveModalPoints = async (array) => {
    const Data = {};
    if (typeGraphic === "Ежемесячный" || typeGraphic === "Ежегодовой") {
      if (array[0]["id"]) {
        const arrayReceived = array.map((item) => ({
          _id: item.id,
          value: item.value,
          valueDate: item.valueDate,
          ...(typeGraphic === "Ежегодовой"
            ? { correlationType: item.correlationType }
            : {}),
          ...(typeGraphic === "Ежемесячный"
            ? { correlationType: item.correlationType }
            : {}),
        }));
        Data.statisticDataUpdateDtos = arrayReceived;
      } else {
        const formatDate = array.map((item) => {
          return {
            ...item,
            valueDate: new Date(item.valueDate),

            ...(typeGraphic === "Ежегодовой"
              ? { correlationType: item.correlationType }
              : {}),
            ...(typeGraphic === "Ежемесячный"
              ? { correlationType: item.correlationType }
              : {}),
          };
        });
        Data.statisticDataCreateDtos = formatDate;
      }
    } else {
      const endArray = array.filter((item) => item.value != "");
      const create = endArray.filter((item) => !item.id);
      const received = endArray
        .filter((item) => item.id)
        .map((item) => ({
          _id: item.id,
          value: item.value,
          valueDate: item.valueDate,
        }));

      if (create.length > 0) {
        const formatDate = create.map((item) => {
          return {
            ...item,
            valueDate: new Date(item.valueDate),
          };
        });
        Data.statisticDataCreateDtos = formatDate;
      }
      if (received.length > 0) {
        Data.statisticDataUpdateDtos = received;
      }
    }
    await updateStatistics({
      statisticId,
      _id: statisticId,
      ...Data,
    })
      .unwrap()
      .then(() => {
        setOpenModal(false);
        setActiveIndex(null);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  //Для стрелок влева вправо график менять

  const handleArrowLeftClick = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const handleArrowRightClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const functionForColorFirstPoint = (startDate) => {
    if (typeGraphic === "Ежедневный") {
      const colorFirstPoint = new Date(startDate);
      colorFirstPoint.setDate(colorFirstPoint.getDate() + (count - 1));
      const element = statisticDatas.find(
        (item) =>
          new Date(item.valueDate).toISOString().split("T")[0] ===
          colorFirstPoint.toISOString().split("T")[0]
      );
      setColorFirstPoint(element?.value);
    }

    if (typeGraphic === "Ежемесячный") {
      const oneMonth = statisticDatas.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ

        const minDate = new Date();
        minDate.setMonth(minDate.getMonth() - 13 + count);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() - 12 + count);
        if (
          !isNaN(itemDate) &&
          item?.correlationType !== "Год" &&
          itemDate >= minDate &&
          itemDate <= maxDate
        ) {
          if (item?.correlationType === "Месяц") {
            acc[monthKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
              correlationType: "Месяц",
            };
          }

          if (!acc[monthKey]) {
            acc[monthKey] = {
              valueSum: 0,
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
            };
          }

          if (!acc[monthKey]?.correlationType) {
            acc[monthKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      const firstMonthData = Object.values(oneMonth)[0];
      console.log("firstMonthData", firstMonthData);
      if (firstMonthData) {
        setColorFirstPoint(firstMonthData.valueSum);
      }

      // const oneMonth = statisticDatas.reduce((acc, item) => {
      //   const itemDate = new Date(item.valueDate);
      //   const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ

      //   const minDate = new Date();
      //   minDate.setMonth(minDate.getMonth() - 13);
      //   const maxDate = new Date();
      //   maxDate.setMonth(maxDate.getMonth() - 12);
      //   if (
      //     !isNaN(itemDate) &&
      //     item?.correlationType !== "Год" &&
      //     itemDate >= minDate &&
      //     itemDate <= maxDate
      //   ) {
      //     if (item?.correlationType === "Месяц") {
      //       acc[monthKey] = {
      //         id: item.id,
      //         valueSum: item.value,
      //         year: itemDate.getFullYear(),
      //         month: itemDate.getMonth() + 1,
      //         correlationType: "Месяц",
      //       };
      //     }

      //     if (!acc[monthKey]) {
      //       acc[monthKey] = {
      //         valueSum: 0,
      //         year: itemDate.getFullYear(),
      //         month: itemDate.getMonth() + 1,
      //       };
      //     }

      //     if (!acc[monthKey]?.correlationType) {
      //       acc[monthKey].valueSum += item.value;
      //     }
      //   }
      //   return acc;
      // }, {});

      // const firstMonthData = Object.values(oneMonth)[0];
      // if (firstMonthData) {
      //   setColorFirstPoint(firstMonthData.valueSum);
      // }
    }

    if (typeGraphic === "Ежегодовой") {
      const dataMonth = countMonthsForGraphicYear();
      const startDate = new Date().getFullYear() - 12 + count;

      const dataWithCorrelationTypeYear = statisticDatas?.filter(
        (item) =>
          item.correlationType === "Год" &&
          startDate == new Date(item.valueDate).getFullYear()
      );

      const prepareData = dataMonth.reduce((acc, month) => {
        const date = new Date(month.valueDate);
        const yearKey = `${date.getFullYear()}`;

        const elementWithSameYear = dataWithCorrelationTypeYear.find(
          (el) => new Date(el.valueDate).getFullYear() === date.getFullYear()
        );

        if (elementWithSameYear && !acc[yearKey]) {
          acc[yearKey] = {
            id: month.id,
            valueSum: elementWithSameYear.value,
            correlationType: elementWithSameYear.correlationType,
          };
          return acc;
        }

        if (!acc[yearKey]) {
          // Если года ещё нет в объекте, создаём новую запись
          acc[yearKey] = {
            valueSum: 0,
            year: date.getFullYear(),
          };
        }

        // Если у года нет свойства correlationType, добавляем значение к valueSum
        if (!acc[yearKey]?.correlationType) {
          acc[yearKey].valueSum += month.value;
        }

        return acc;
      }, {});

      const objectdataWithCorrelationTypeYear =
        dataWithCorrelationTypeYear.reduce((acc, item) => {
          const itemDate = new Date(item.valueDate).getFullYear();
          const yearKey = `${itemDate}`;
          if (startDate === itemDate) {
            if (!acc[yearKey]) {
              acc[yearKey] = {
                id: item.id,
                valueSum: item.value,
                correlationType: item.correlationType,
              };
            }
          }

          return acc;
        }, {});

      const prepareObjectData = _.merge(
        {},
        prepareData,
        objectdataWithCorrelationTypeYear
      );

      const firstYearData = Object.values(prepareObjectData)[0];
      console.log("firstYearData", firstYearData);
      if (firstYearData) {
        setColorFirstPoint(firstYearData.valueSum);
      }
    }
  };

  const updateStatisticsData = () => {
    setReceivedPoints([]);
    setArrayPoints([]);
    setShowPoints([]);
    setShowCorrelationPoint([]);

    if (!statisticDatas.length) return;

    if (typeGraphic === "Ежедневный") {
      const dayNow = new Date();
      const currentWeekday = dayNow.getDay(); // Текущий день недели (0 - Воскресенье, 1 - Понедельник и т.д.)

      // Определяем начальную дату - ближайший предыдущий день `day`, не более 7 дней назад
      const startDate = new Date(dayNow);
      let dayDifference;

      if (currentWeekday >= reportDay) {
        dayDifference = currentWeekday - reportDay;
      } else {
        dayDifference = 7 - (reportDay - currentWeekday);
      }

      startDate.setDate(dayNow.getDate() - dayDifference);

      // Ограничиваем начальную дату максимум 7 днями назад от текущего дня
      const maxStartDate = new Date(dayNow);
      maxStartDate.setDate(dayNow.getDate() - 7);

      if (startDate < maxStartDate) {
        startDate.setTime(maxStartDate.getTime());
      }

      // Создаем массив всех дат за последние 7 дней
      const last7Days = [];
      for (let i = count; i < 7 + count; i++) {
        const date = new Date(startDate);
        date.setDate(dayNow.getDate() + i);
        last7Days.push(date.toISOString().split("T")[0]);

        if (i === count) {
          functionForColorFirstPoint(startDate);
        }
      }

      // Группируем данные по дате и фильтруем
      const dataMap = statisticDatas.reduce((acc, item) => {
        const itemDate = item.valueDate.split("T")[0];
        if (!item.correlationType) {
          acc[itemDate] = {
            ...item,
            valueDate: itemDate,
          };
        }

        return acc;
      }, {});

      // Создаем массив данных для последних 7 дней, добавляем нулевые значения, если данные отсутствуют
      const updatedPoints = last7Days.map((date) => {
        if (dataMap[date] && dataMap[date].correlationType === null) {
          return dataMap[date];
        } else {
          return {
            id: date,
            valueDate: date,
            value: "", // Заполняем нулевым значением, если данных за день нет
          };
        }
      });

      const crPoints = updatedPoints.filter((item) => item.value === "");
      const _updatedPoints = updatedPoints.filter((item) => item.value !== "");

      const updatedPoints1 = _updatedPoints.map((item) => ({ ...item }));

      setOldReceivedPoints(updatedPoints1);
      setReceivedPoints(_updatedPoints);
      setCreatePoints(crPoints);
    }

    if (typeGraphic === "Ежемесячный") {
      const arrayPointsCorrelationTypeisMonth = statisticDatas.filter(
        (item) => item.correlationType === "Месяц"
      );
      setShowCorrelationPoint(arrayPointsCorrelationTypeisMonth);
      // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
      const monthlyData = statisticDatas.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
        if (
          !isNaN(itemDate) &&
          new Date(new Date().setMonth(new Date().getMonth() - 14 + count)) <
            itemDate
        ) {
          if (item?.correlationType === "Месяц") {
            acc[monthKey] = {
              id: item.id,
              valueSum: Number(item.value),
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
              correlationType: "Месяц",
            };
          }
          if (!acc[monthKey]) {
            acc[monthKey] = {
              valueSum: Number(0),
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
            };
          }

          if (!acc[monthKey]?.correlationType) {
            acc[monthKey].valueSum += Number(item.value);
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (последний день месяца)
      const updatedMonthlyPoints = [];

      // Для каждого месяца от 14 месяцев назад до текущего добавляем данные
      for (let i = new Date().getMonth() - 14 + count; i <= count; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() + i);
        const monthKey = `${monthDate.getFullYear()}-${
          monthDate.getMonth() + 1
        }`;

        // Если данных нет для этого месяца, создаем запись с суммой 0
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            valueSum: Number(0),
            year: monthDate.getFullYear(),
            month: monthDate.getMonth() + 1,
          };
        }

        const lastDayOfMonth = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          0
        ); // Получаем последний день месяца
        const year = lastDayOfMonth.getFullYear();
        const monthValue = lastDayOfMonth.getMonth() + 1; // Месяцы начинаются с 0
        const date = lastDayOfMonth.getDate(); // Дата

        updatedMonthlyPoints.push({
          id: monthlyData[monthKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${year}-${monthValue}-${date}`, // Форматирование в 'год-месяц-день'
          value: monthlyData[monthKey].valueSum, // Сумма за месяц
          ...(monthlyData[monthKey].correlationType
            ? { correlationType: monthlyData[monthKey].correlationType }
            : {}),
        });
      }

      // Сортируем данные по дате, от последнего месяца к первому
      updatedMonthlyPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setReceivedPoints(updatedMonthlyPoints);

      functionForColorFirstPoint();
    }

    if (typeGraphic === "Ежегодовой") {
      const arrayPointsCorrelationTypeisYear = statisticDatas.filter(
        (item) => item.correlationType === "Год"
      );
      setShowCorrelationPoint(arrayPointsCorrelationTypeisYear);

      const dataMonth = countMonthsForGraphicYear();
      const dataWithCorrelationTypeYear = statisticDatas?.filter(
        (item) =>
          item.correlationType === "Год" &&
          new Date().getFullYear() - 12 + count <
            new Date(item.valueDate).getFullYear()
      );

      const prepareData = dataMonth.reduce((acc, month) => {
        const date = new Date(month.valueDate);
        const yearKey = `${date.getFullYear()}`;

        const elementWithSameYear = dataWithCorrelationTypeYear.find(
          (el) => new Date(el.valueDate).getFullYear() === date.getFullYear()
        );

        if (elementWithSameYear && !acc[yearKey]) {
          acc[yearKey] = {
            id: month.id,
            valueSum: Number(elementWithSameYear.value),
            correlationType: elementWithSameYear.correlationType,
          };
          return acc;
        }

        if (!acc[yearKey]) {
          // Если года ещё нет в объекте, создаём новую запись
          acc[yearKey] = {
            valueSum:  Number(0),
            year: date.getFullYear(),
          };
        }

        // Если у года нет свойства correlationType, добавляем значение к valueSum
        if (!acc[yearKey]?.correlationType) {
          acc[yearKey].valueSum += Number(month.value);
        }

        return acc;
      }, {});

      const objectdataWithCorrelationTypeYear =
        dataWithCorrelationTypeYear.reduce((acc, item) => {
          const itemDate = new Date(item.valueDate);
          const yearKey = `${itemDate.getFullYear()}`;
          if (
            new Date(
              new Date().setFullYear(new Date().getFullYear() - 12 + count)
            ) < itemDate
          ) {
            if (!acc[yearKey]) {
              acc[yearKey] = {
                id: item.id,
                valueSum: Number(item.value),
                correlationType: item.correlationType,
              };
            }
          }

          return acc;
        }, {});

      const prepareObjectData = _.merge(
        {},
        prepareData,
        objectdataWithCorrelationTypeYear
      );
      const updatedYearPoints = [];

      // Для каждого года от 13 лет назад до текущего добавляем данные
      for (
        let i = new Date().getFullYear() - 11 + count;
        i <= new Date().getFullYear() + count;
        i++
      ) {
        const yearDate = new Date();
        yearDate.setFullYear(i);
        const yearKey = `${yearDate.getFullYear()}`;

        // Если данных нет для этого года, создаем запись с суммой 0
        if (!prepareObjectData[yearKey]) {
          prepareObjectData[yearKey] = {
            valueSum: Number(0),
            year: yearDate.getFullYear(),
          };
        }

        updatedYearPoints.push({
          id: prepareObjectData[yearKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${yearDate.getFullYear()}-01-01`,
          value: prepareObjectData[yearKey].valueSum, // Сумма за год
          ...(prepareObjectData[yearKey].correlationType
            ? { correlationType: prepareObjectData[yearKey].correlationType }
            : {}),
        });
      }

      updatedYearPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );
      console.log("updatedYearPoints", updatedYearPoints);
      setReceivedPoints(updatedYearPoints);
    }

    if (typeGraphic === "13" || typeGraphic === "26" || typeGraphic === "52") {
      const today = new Date();
      today.setDate(today.getDate() + count * 7);
      const end = new Date(today);

      const start = new Date(end);
      start.setDate(end.getDate() - (Number(typeGraphic) + 1) * 7);

      const selectedDayOfWeek = parseInt(reportDay);
      const result = [];

      let currentDate = new Date(start);
      let currentSum = 0;

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            if (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.correlationType === null
            ) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.correlationType === null
            );
          })
          .reduce((sum, item) =>  Number(sum) + Number(item.value), 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) => {
              if (item.myID) {
                return { ...item };
              } else {
                return {
                  ...item,
                  myID: valueDate.toISOString().split("T")[0],
                };
              }
            })
          );

          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
  };

  useEffect(() => {
    updateStatisticsData();
  }, [count]);

  // Все для модального окна при смене отчетного дня
  const dayWeek = (day, func) => {
    switch (Number(day)) {
      case 0:
        func("Воскресенье");
        break;
      case 1:
        func("Понедельник");
        break;
      case 2:
        func("Вторник");
        break;
      case 3:
        func("Среда");
        break;
      case 4:
        func("Четверг");
        break;
      case 5:
        func("Пятница");
        break;
      case 6:
        func("Суббота");
        break;
      default:
        break;
    }
  };

  const save = () => {
    console.log(`reportDay =${reportDay}`);
    console.log(
      `currentOrganization?.reportDay =${currentOrganization?.reportDay}`
    );
    if (reportDay != currentOrganization?.reportDay) {
      setOpenModalReportDay(true);
      dayWeek(reportDay, setShowReportDay);
      dayWeek(currentOrganization?.reportDay, setShowReportDayComes);
    } else {
      saveUpdateStatistics();
    }
  };

  const btnYes = async () => {
    try {
      await saveUpdateOrganization(); // Сначала выполняем обновление организации
      localStorage.setItem("reportDay", Number(reportDay));
      setOpenModalReportDay(false);
      // Добавляем задержку в 1 секунду
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await saveUpdateStatistics(); // Затем обновляем статистику через секунду
    } catch (error) {
      console.error("Ошибка при выполнении операций:", error);
    }
  };

  const btnNo = () => {
    saveUpdateStatistics();
  };

  const saveUpdateOrganization = async () => {
    await updateOrganization({
      _id: reduxSelectedOrganizationId,
      reportDay: Number(reportDay),
    })
      .unwrap()
      .then(() => {
        setOpenModalReportDay(false);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  // Для кастомного Select
  const weeksDay = [
    { id: 1, value: "Понедельник" },
    { id: 2, value: "Вторник" },
    { id: 3, value: "Среда" },
    { id: 4, value: "Четверг" },
    { id: 5, value: "Пятница" },
    { id: 6, value: "Суббота" },
    { id: 0, value: "Воскресенье" },
  ];

  const selectType = [
    { id: "Прямая", value: "Прямая" },
    { id: "Обратная", value: "Обратная" },
  ];

  const selectViewGraphic = [
    { id: "Ежедневный", value: "Ежедневный", view: "Ежедневный" },
    { id: "Ежемесячный", value: "Ежемесячный", view: "Ежемесячный" },
    { id: "Ежегодовой", value: "Ежегодовой", view: "Ежегодовой" },
    { id: "13", value: "13", view: "13 недель" },
    { id: "26", value: "26", view: "26 недель" },
    { id: "52", value: "52", view: "52 недели" },
  ];

  const selectStatistics = (id) => {
    setStatisticId(id);
  };

  return (
    <div className={classes.dialog}>
      <Headers name={"статистика"} funcActiveHint={() => setOpen(true)}>
        <BottomHeaders
          create={functionOpenModalForCreated}
          update={save}
          refCreate={refCreate}
          refUpdate={refUpdate}
        >
          <Select
            refSelect={refDay}
            name={"Отчетный день"}
            value={reportDay}
            onChange={setReportDay}
            array={weeksDay}
            arrayItem={"value"}
          ></Select>
        </BottomHeaders>
      </Headers>

      <ConfigProvider locale={ruRU}>
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </ConfigProvider>

      <div className={classes.main}>
        {isErrorGetStatistics && isErrorGetPosts ? (
          <>
            <HandlerQeury
              Error={isErrorGetStatistics || isErrorGetPosts}
            ></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetStatisticId ? (
              <HandlerQeury Error={isErrorGetStatisticId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury
                  Loading={isLoadingGetStatistics}
                  Fetching={isFetchingGetStatistics}
                ></HandlerQeury>

                <HandlerQeury Loading={isLoadingGetPosts}></HandlerQeury>

                {isFetchingGetStatisticId || isLoadingGetStatisticId ? (
                  <HandlerQeury
                    Loading={isLoadingGetStatisticId}
                    Fetching={isFetchingGetStatisticId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentStatistic.id ? (
                      <>
                        <div className={classes.block1}>
                          <Graphic
                            colorFirstPoint={colorFirstPoint}
                            data={[...receivedPoints, ...createPoints]}
                            name={name}
                            setName={setName}
                            typeGraphic={typeGraphic}
                            type={type}
                          ></Graphic>

                          <div className={classes.blockArrrow}>
                            <div
                              ref={refArrowLeft}
                              className={classes.statisticsArrow}
                            >
                              <img
                                src={statisticsArrowLeft}
                                alt="statisticsArrowLeftWhite"
                                onClick={handleArrowLeftClick}
                              />
                            </div>
                            <div
                              ref={refArrowRight}
                              className={classes.statisticsArrow}
                            >
                              <img
                                src={statisticsArrowRight}
                                alt="statisticsArrowRightWhite"
                                onClick={handleArrowRightClick}
                              />
                            </div>
                          </div>
                        </div>

                        <div className={classes.block2}>
                          <div
                            ref={refAddPoint}
                            className={classes.addPoint}
                            onClick={addPoint}
                          >
                            <img src={addBlock} alt="addBlock" />
                          </div>

                          {statisticId !== "" ? (
                            <div className={classes.points}>
                              {createPoints
                                ?.sort(
                                  (a, b) =>
                                    Date.parse(b.valueDate) -
                                    Date.parse(a.valueDate)
                                )
                                ?.map((item, index) => {
                                  if (item.valueDate === "") {
                                    item.valueDate = new Date()
                                      .toISOString()
                                      .split("T")[0];
                                  }
                                  return (
                                    <div key={index} className={classes.item}>
                                      <input
                                        type="date"
                                        value={item.valueDate}
                                        onChange={(e) => {
                                          onChangePoints(
                                            "",
                                            e.target.value,
                                            "valueDate",
                                            null,
                                            item.id
                                          );
                                        }}
                                        className={classes.date}
                                      />
                                      <input
                                        type="text"
                                        value={item.value}
                                        inputMode="numeric"
                                        placeholder="—"
                                        onChange={(e) => {
                                          const newValue =
                                            e.target.value.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                          onChangePoints(
                                            "",
                                            newValue,
                                            "value",
                                            null,
                                            item.id
                                          );
                                        }}
                                        className={classes.number}
                                      />
                                    </div>
                                  );
                                })}

                              {receivedPoints?.map((item, index) => {
                                if (typeGraphic === "Ежедневный") {
                                  return (
                                    <div key={index} className={classes.item}>
                                      <input
                                        type="date"
                                        value={item.valueDate}
                                        onChange={(e) => {
                                          onChangePoints(
                                            "received",
                                            e.target.value,
                                            "valueDate",
                                            index,
                                            null
                                          );
                                        }}
                                        className={classes.date}
                                        disabled={disabledPoints}
                                      />

                                      <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => {
                                          const newValue =
                                            e.target.value.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                          onChangePoints(
                                            "received",
                                            newValue,
                                            "value",
                                            index,
                                            null
                                          );
                                        }}
                                        className={classes.number}
                                        disabled={disabledPoints}
                                      />
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div
                                      key={index}
                                      className={`${classes.item}  ${
                                        classes.itemHover
                                      }  ${
                                        activeIndex === index
                                          ? classes.active
                                          : ""
                                      }`}
                                      onClick={() => {
                                        setActiveIndex(index);
                                        showCurrentPoint(item.valueDate);
                                      }}
                                    >
                                      <span
                                        disabled={disabledPoints}
                                        className={`${classes.date} ${classes.textGrey}`}
                                      >
                                        {getDateFormatSatatistic(
                                          item.valueDate,
                                          typeGraphic
                                        )}
                                      </span>

                                      <span
                                        className={`${classes.number} ${classes.textGrey}`}
                                        disabled={disabledPoints}
                                      >
                                        {item.value}
                                      </span>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          ) : (
                            <></>
                          )}

                          <div
                            ref={refDeletePoint}
                            className={classes.deletePoint}
                            onClick={deletePoint}
                          >
                            <img src={trash} alt="trash" />
                          </div>
                        </div>

                        <div className={classes.block3}>
                          <div className={classes.row1}>
                            <Input
                              refInput={refName}
                              name={"Статистика"}
                              value={name}
                              onChange={setName}
                            >
                              <Lupa
                                refLupa={refLupa}
                                setIsOpenSearch={setIsOpenSearch}
                                isOpenSearch={isOpenSearch}
                                select={selectStatistics}
                                array={statistics}
                                arrayItem={"name"}
                                positionBottomStyle={"0"}
                              ></Lupa>
                            </Input>

                            <Select
                              refSelect={refType}
                              name={"Тип"}
                              value={type}
                              onChange={setType}
                              array={selectType}
                              arrayItem={"value"}
                            ></Select>

                            <Select
                              refSelect={refPost}
                              name={"Пост"}
                              value={postId}
                              onChange={setPostId}
                              array={allPosts}
                              arrayItem={"postName"}
                            ></Select>

                            <Select
                              refSelect={refTypeGraphic}
                              name={"График"}
                              value={typeGraphic}
                              onChange={setTypeGraphic}
                              array={selectViewGraphic}
                              arrayItem={"view"}
                            ></Select>
                          </div>

                          <div className={classes.row2}>
                            <textarea
                              ref={refDescription}
                              placeholder="Описание статистики: что и как считать"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className={classes.textMontserrat}
                            ></textarea>
                          </div>
                        </div>

                        <HandlerMutation
                          Loading={isLoadingPostStatisticMutation}
                          Error={
                            isErrorPostStatisticMutation &&
                            localIsResponsePostStatisticsMutation
                          } // Учитываем ручной сброс
                          Success={
                            isSuccessPostStatisticMutation &&
                            localIsResponsePostStatisticsMutation
                          } // Учитываем ручной сброс
                          textSuccess={"Статистика создана"}
                          textError={
                            ErrorPostStatisticMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPostStatisticMutation.data.errors[0]
                                  .errors[0]
                              : ErrorPostStatisticMutation?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingUpdateStatisticMutation}
                          Error={
                            isErrorUpdateStatisticMutation &&
                            localIsResponseUpdateStatisticsMutation
                          } // Учитываем ручной сброс
                          Success={
                            isSuccessUpdateStatisticMutation &&
                            localIsResponseUpdateStatisticsMutation
                          } // Учитываем ручной сброс
                          textSuccess={"Статистика обновлена"}
                          textError={
                            ErrorUpdateStatisticMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdateStatisticMutation.data.errors[0]
                                  .errors[0]
                              : ErrorUpdateStatisticMutation?.data?.message
                          }
                        ></HandlerMutation>

                        {openModal && (
                          <>
                            <div className={classes.modal}>
                              <table className={classes.modalTable}>
                                <div className={classes.tableHeader}>
                                  {typeGraphic === "Ежемесячный" ||
                                  typeGraphic === "Ежегодовой" ? (
                                    <div className={classes.tableHeading}>
                                      <span>Значение за месяц</span>
                                      <div className={classes.tableHintWrapper}>
                                        <img
                                          src={hint}
                                          alt="hint"
                                          className={classes.tableHint}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className=""></div>
                                  )}

                                  <div className={classes.iconSaveModal}>
                                    <img
                                      src={Blacksavetmp}
                                      alt="Blacksavetmp"
                                      className={classes.image}
                                      onClick={() => {
                                        saveModalPoints(showPoints);
                                      }}
                                    />
                                  </div>
                                </div>

                                <img
                                  src={exit}
                                  alt="exit"
                                  onClick={exitModal}
                                  className={classes.exitImage}
                                />

                                <thead>
                                  <tr>
                                    <th>Дата</th>
                                    <th>Значение</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      {showPoints?.map((item) => (
                                        <div
                                          key={item.id}
                                          className={classes.row}
                                        >
                                          <span
                                            className={`${classes.date} ${classes.textGrey}`}
                                          >
                                            {getDateFormatSatatistic(
                                              item.valueDate,
                                              typeGraphic
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </td>

                                    <td>
                                      {showPoints?.map((item, index) => (
                                        <div
                                          key={item.id}
                                          className={classes.row}
                                        >
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="—"
                                            value={
                                              item.value === null ||
                                              item.value === ""
                                                ? ""
                                                : item.value
                                            }
                                            onChange={(e) => {
                                              const newValue =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                              updateModalPoint(
                                                newValue === ""
                                                  ? null
                                                  : newValue,
                                                index
                                              );
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите статистику"}
                        ></WaveLetters>
                        <div className={classes.block1}></div>
                        <div className={classes.block2}></div>
                        <div className={classes.block3}>
                          <div className={classes.row1}>
                            <Input
                              refInput={refName}
                              name={"Статистика"}
                              value={name}
                              onChange={setName}
                            >
                              <Lupa
                                refLupa={refLupa}
                                setIsOpenSearch={setIsOpenSearch}
                                isOpenSearch={isOpenSearch}
                                select={selectStatistics}
                                array={statistics}
                                arrayItem={"name"}
                                positionBottomStyle={"0"}
                              ></Lupa>
                            </Input>
                          </div>
                          <div className={classes.row2}>
                            <textarea
                              disabled
                              placeholder="Описание статистики: что и как считать"
                            ></textarea>
                          </div>
                        </div>
                      </>
                    )}

                    {openModalReportDay && (
                      <>
                        <div className={classes.modalDelete}>
                          <div className={classes.modalDeleteElement}>
                            <img
                              src={exit}
                              alt="exit"
                              className={classes.exitImage}
                              onClick={() => setOpenModalReportDay(false)}
                            />
                            <div className={classes.modalRow1}>
                              <span className={classes.text}>
                                Вы поменяли отчетный день с <span> </span>
                                <span style={{ fontWeight: "700" }}>
                                  {showReportDayComes}
                                </span>
                                <span> на </span>
                                <span style={{ fontWeight: "700" }}>
                                  {showReportDay}
                                </span>
                                . Если подтвердите действие, то отчетный день
                                поменяется у всей организации.
                              </span>
                            </div>

                            <div className={classes.modalRow2}>
                              <button
                                className={`${classes.btnYes} ${classes.textBtnYes}`}
                                onClick={btnYes}
                              >
                                Да
                              </button>
                              <button
                                className={`${classes.btnNo} ${classes.textBtnNo}`}
                                onClick={btnNo}
                              >
                                Нет
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <HandlerMutation
                      Loading={isLoadingUpdateOrganizationMutation}
                      Error={
                        isErrorUpdateOrganizationMutation &&
                        localIsResponseUpdateOrganizationMutation
                      }
                      Success={
                        isSuccessUpdateOrganizationMutation &&
                        localIsResponseUpdateOrganizationMutation
                      }
                      textSuccess={`Обновился отчетный день у организации на ${showReportDay}`}
                      textError={
                        ErrorOrganization?.data?.errors?.[0]?.errors?.[0]
                          ? ErrorOrganization.data.errors[0].errors[0]
                          : ErrorOrganization?.data?.message
                      }
                    ></HandlerMutation>

                    {openModalForCreated && (
                      <ModalSelectRadio
                        nameTable={"Название поста"}
                        handleSearchValue={inputSearchModal}
                        handleSearchOnChange={handleInputChangeModalSearch}
                        handleRadioChange={handleRadioChange}
                        exit={() => {
                          setOpenModalForCreated(false);
                        }}
                        filterArray={filterArraySearchModal}
                        array={allPosts}
                        arrayItem={"postName"}
                        selectedItemID={selectedPostIdForCreated}
                        save={createStatistics}
                      ></ModalSelectRadio>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
