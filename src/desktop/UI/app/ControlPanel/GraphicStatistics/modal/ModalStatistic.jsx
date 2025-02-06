import React, { useEffect, useRef, useState } from "react";
import classes from "./ModalStatistic.module.css";
import * as d3 from "d3";
import getDateFormatSatatistic from "@Custom/Function/getDateFormatStatistic";
import exitModal from "@image/exitModal.svg";
import arrowLeft from "@image/statisticsArrowLeft.svg";
import arrowRight from "@image/statisticsArrowRight.svg";

const ModalStatistic = ({
  data,
  graphicTypeBD,
  type,
  name,
  exit,
  reportDay,
}) => {
  console.log("ModalStatistic");
  
  const svgRef = useRef();
  const [width, setWidth] = useState(850);
  const [height, setHeight] = useState(640);
  const [pointsForGraphic, setPointsForGraphic] = useState([]);
  const [typeGraphic, setTypeGraphic] = useState(graphicTypeBD);
  const [count, setCount] = useState(0);

  const buttonTypes = [
    {
      type: "13",
      value: "13 недель",
    },
    {
      type: "26",
      value: "26 недель",
    },
    {
      type: "52",
      value: "52 недели",
    },
    {
      type: "Ежедневный",
      value: "Ежедневный",
    },
    {
      type: "Ежемесячный",
      value: "Ежемесячный",
    },
    {
      type: "Ежегодовой",
      value: "Ежегодовой",
    },
  ];

  const handleTypeGraphicButtonClick = (type) => {
    setTypeGraphic(type);
  };

  // Высота графика в хависимотси от экрана
  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerHeight > 900) {
        setHeight(640);
      } else if (window.innerHeight > 500) {
        setHeight(420);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Изменение pointsForGraphic в зависимости от типа графика
  useEffect(() => {
    setCount(0); // обнуление кол-во нажатий при смене графика

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
      const filteredData = data
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
            item.isCorrelation !== true
          );
        })
        ?.map((item) => ({
          ...item,
          valueDate: item.valueDate?.split("T")[0], // Предполагаем, что valueDate - строка с датой
        }));

      const updatedPoints = [];
      const _createdPoints = [];

      allDates.forEach((date) => {
        const existingPoint = filteredData.find(
          (item) => item.valueDate === date
        );

        if (existingPoint) {
          updatedPoints.push(existingPoint);
        } else {
          _createdPoints.push({
            id: date,
            valueDate: date,
            value: "",
            isCorrelation: false,
          });
        }
      });

      // Сортируем данные по убыванию даты
      updatedPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );
      _createdPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );
      // Устанавливаем данные
      setPointsForGraphic([...updatedPoints, ..._createdPoints]);
    }

    if (typeGraphic === "Ежемесячный") {
      // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
      const monthlyData = data.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
        if (
          !isNaN(itemDate) &&
          new Date(new Date().setMonth(new Date().getMonth() - 13)) < itemDate
        ) {
          if (item?.isCorrelation === true) {
            acc[monthKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
              isCorrelation: true,
            };
          }

          // Если месяца ещё нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[monthKey] || !acc[monthKey]?.isCorrelation) {
            if (!acc[monthKey]) {
              acc[monthKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                month: itemDate.getMonth() + 1,
                isCorrelation: false,
              };
            }
            acc[monthKey].valueSum += item.value;
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
            valueSum: 0,
            year: monthDate.getFullYear(),
            month: monthDate.getMonth() + 1,
            isCorrelation: false,
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
          isCorrelation: monthlyData[monthKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего месяца к первому
      updatedMonthlyPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setPointsForGraphic(updatedMonthlyPoints);
    }

    if (typeGraphic === "Ежегодовой") {
      // Группируем данные по годам и суммируем `valueDate` за каждый год
      const yearData = data.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const yearKey = `${itemDate.getFullYear()}`;
        // Проверяем, что дата корректна и меньше чем на 13 лет от текущего года
        if (
          !isNaN(itemDate) &&
          new Date().getFullYear() - 12 < itemDate.getFullYear()
        ) {
          if (item?.isCorrelation === true) {
            acc[yearKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              isCorrelation: true,
            };
          }

          // Если года еще нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[yearKey] || !acc[yearKey]?.isCorrelation) {
            if (!acc[yearKey]) {
              acc[yearKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                isCorrelation: false,
              };
            }
            acc[yearKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (первый день года)
      const updatedYearPoints = [];

      // Для каждого года от 13 лет назад до текущего добавляем данные
      for (let i = 0; i < 12; i++) {
        const yearDate = new Date();
        yearDate.setFullYear(yearDate.getFullYear() - i);
        const yearKey = `${yearDate.getFullYear()}`;

        // Если данных нет для этого года, создаем запись с суммой 0
        if (!yearData[yearKey]) {
          yearData[yearKey] = {
            valueSum: 0,
            year: yearDate.getFullYear(),
            isCorrelation: false,
          };
        }

        updatedYearPoints.push({
          id: yearData[yearKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${yearDate.getFullYear()}-01-01`,
          value: yearData[yearKey].valueSum, // Сумма за год
          isCorrelation: yearData[yearKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего года к первому
      updatedYearPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setPointsForGraphic(updatedYearPoints);
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
        console.log("11111111111111");
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        console.log("2222222222222222");
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        const currentSum = data
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            const isValid =
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true;

            return isValid;
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setPointsForGraphic(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
  }, [typeGraphic]);

  // Построение svg картинки
  useEffect(() => {
    pointsForGraphic.sort(
      (a, b) => new Date(a.valueDate) - new Date(b.valueDate)
    );

    // const formatDate = d3.timeFormat("%d.%m.%y");
    // const parseDate = d3.timeParse("%Y-%m-%d");

    const margin = { top: 40, right: 20, bottom: 80, left: 50 };

    const minValue = d3.min(pointsForGraphic, (d) => d.value);
    const maxValue = d3.max(pointsForGraphic, (d) => d.value);

    // Устанавливаем верхнюю границу оси Y с небольшим запасом
    const upperLimit = maxValue * 1.1; // Увеличиваем максимальное значение на 10%

    const x = d3
      .scalePoint()
      .domain(
        pointsForGraphic.map((d) =>
          d.valueDate === "" || d.valueDate === null
            ? "дата"
            : getDateFormatSatatistic(d.valueDate, typeGraphic)
        )
      )
      .range([margin.left, width - margin.right])
      .padding(0);

    // Если type === "Обратная", то ось Y будет инвертирована, а верхний предел будет больше
    const y =
      type === "Обратная"
        ? d3
            .scaleLinear()
            .domain([0, upperLimit]) // Начинаем с 0 для обратного типа
            .nice()
            .range([margin.top, height - margin.bottom])
        : d3
            .scaleLinear()
            .domain([0, upperLimit]) // Начинаем с 0 для обычного типа
            .nice()
            .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) =>
        x(
          d.valueDate === "" || d.valueDate === null
            ? "дата"
            : getDateFormatSatatistic(d.valueDate, typeGraphic)
        )
      )
      .y((d) => y(d.value))
      .defined((d) => d.value !== null);

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const tickValues = pointsForGraphic.map((d) =>
      d.valueDate === "" || d.valueDate === null
        ? "дата"
        : getDateFormatSatatistic(d.valueDate, typeGraphic)
    );

    // Получаем значения для горизонтальных линий сетки с использованием y.ticks()
    const yTickValues = y.ticks(5); // Используем метод ticks() для точных значений

    // Добавляем вертикальные линии сетки
    svg
      .selectAll(".grid-vertical")
      .data(tickValues)
      .enter()
      .append("line")
      .attr("class", "grid-vertical")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#4a4a4a") // Темный цвет для сетки
      .attr("stroke-width", 1)
      .attr("opacity", 0.3);

    // Добавляем горизонтальные линии сетки
    svg
      .selectAll(".grid-horizontal")
      .data(yTickValues)
      .enter()
      .append("line")
      .attr("class", "grid-horizontal")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#4a4a4a") // Темный цвет для сетки
      .attr("stroke-width", 1)
      .attr("opacity", 0.3);

    const xAxis = d3.axisBottom(x);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "end")
      .attr("dx", "-10px")
      .attr("dy", "-5px")
      .style("font-weight", "bold")
      .style("font-size", "12px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2s"))); // Format Y axis

    pointsForGraphic.forEach((d, i) => {
      if (i > 0) {
        const prevValue = pointsForGraphic[i - 1].value;
        // Reverse the line color logic based on the 'type' prop
        const color =
          type === "Обратная"
            ? d.value < prevValue
              ? "blue"
              : "red" // Reverse logic for line color
            : d.value < prevValue
            ? "red"
            : "blue"; // Normal logic for line color

        svg
          .append("path")
          .datum([pointsForGraphic[i - 1], d])
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("d", line);
      }
    });

    const getColor = (value, index) => {
      if (index > 0) {
        const prevValue = pointsForGraphic[index - 1].value;
        // Reverse the color logic for points as well
        return type === "Обратная"
          ? value < prevValue
            ? "blue"
            : "red" // Reverse logic for points
          : value < prevValue
          ? "red"
          : "blue"; // Normal logic for points
      } else {
        return "green";
      }
    };

    svg
      .selectAll("circle")
      .data(pointsForGraphic)
      .enter()
      .append("circle")
      .attr("cx", (d) =>
        x(
          d.valueDate === "" || d.valueDate === null
            ? "дата"
            : getDateFormatSatatistic(d.valueDate, typeGraphic)
        )
      )
      .attr("cy", (d) => y(d.value))
      .attr("r", 5)
      .attr("fill", (d, i) => getColor(d.value, i)) // Apply the reversed color logic here
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("r", 7).attr("fill", "orange");

        const tooltipX = x(
          d.valueDate === "" || d.valueDate === null
            ? "дата"
            : getDateFormatSatatistic(d.valueDate, typeGraphic)
        );
        const tooltipY = y(d.value) - 15;

        // Формируем текст для тултипа
        const dateText = `Дата: ${
          d.valueDate === "" || d.valueDate === null
            ? "дата"
            : getDateFormatSatatistic(d.valueDate, typeGraphic)
        }`;
        const valueText = `Значение: ${d.value}`;
        const textWidth = Math.max(dateText.length, valueText.length) * 6; // Оценочная ширина в пикселях

        // Ширина тултипа
        const tooltipWidth = Math.max(120, textWidth + 20);
        const tooltipHeight = 50;

        // Проверка на выход за границы
        const isTopOutOfBound = tooltipY - tooltipHeight < margin.top;
        const isRightOutOfBound =
          tooltipX + tooltipWidth / 2 > width - margin.right;
        const isLeftOutOfBound = tooltipX - tooltipWidth / 2 < margin.left;

        let adjustedX = tooltipX;
        if (isRightOutOfBound)
          adjustedX = width - margin.right - tooltipWidth / 2;
        else if (isLeftOutOfBound) adjustedX = margin.left + tooltipWidth / 2;

        const adjustedY = isTopOutOfBound ? tooltipY + tooltipHeight : tooltipY;

        // Получаем цвет точки
        const pointColor = getColor(d.value, pointsForGraphic.indexOf(d));

        const tooltipGroup = svg
          .append("g")
          .attr("id", "tooltip")
          .attr("transform", `translate(${adjustedX}, ${adjustedY})`);

        tooltipGroup
          .append("rect")
          .attr("x", -tooltipWidth / 2)
          .attr("y", isTopOutOfBound ? 0 : -tooltipHeight)
          .attr("width", tooltipWidth)
          .attr("height", tooltipHeight)
          .attr("fill", pointColor) // Используем цвет точки для фона тултипа
          .attr("rx", 4)
          .attr("ry", 4);

        tooltipGroup
          .append("text")
          .attr("text-anchor", "middle")
          .attr("y", isTopOutOfBound ? 15 : -30)
          .style("font-size", "11px")
          .style("fill", "white")
          .style("font-family", "Montserrat, sans-serif")
          .text(dateText);

        tooltipGroup
          .append("text")
          .attr("text-anchor", "middle")
          .attr("y", isTopOutOfBound ? 35 : -10)
          .style("font-size", "11px")
          .style("fill", "white")
          .style("font-family", "Montserrat, sans-serif")
          .text(valueText);
      })
      .on("mouseout", (event) => {
        const d = d3.select(event.currentTarget).datum();
        const index = pointsForGraphic.indexOf(d);
        d3.select(event.currentTarget)
          .attr("r", 5)
          .attr("fill", getColor(d.value, index)); // Apply the reversed color logic here
        svg.select("#tooltip").remove();
      });
  }, [pointsForGraphic]);

  // Для стрелок на графике
  const handleArrowLeftClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleArrowRightClick = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const updateStatisticsData = () => {
    setPointsForGraphic([]);

    if (!data.length) return;

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
        const date = new Date(dayNow);
        date.setDate(dayNow.getDate() - i);
        last7Days.push(date.toISOString().split("T")[0]);
      }

      // Группируем данные по дате и фильтруем
      const dataMap = data.reduce((acc, item) => {
        const itemDate = item.valueDate.split("T")[0];
        acc[itemDate] = {
          ...item,
          valueDate: itemDate,
        };
        return acc;
      }, {});

      // Создаем массив данных для последних 7 дней, добавляем нулевые значения, если данные отсутствуют
      const updatedPoints = last7Days.map((date) => {
        if (dataMap[date] && dataMap[date].isCorrelation !== true) {
          return dataMap[date];
        } else {
          return {
            id: date,
            valueDate: date,
            value: "", // Заполняем нулевым значением, если данных за день нет
            isCorrelation: false,
          };
        }
      });

      const crPoints = updatedPoints.filter((item) => item.value === "");
      const _updatedPoints = updatedPoints.filter((item) => item.value !== "");

      setPointsForGraphic([..._updatedPoints, ...crPoints]);
    }

    if (typeGraphic === "Ежемесячный") {
      // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
      const monthlyData = data.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
        if (
          !isNaN(itemDate) &&
          new Date(new Date().setMonth(new Date().getMonth() - 14 + count)) <
            itemDate
        ) {
          if (item?.isCorrelation === true) {
            acc[monthKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
              isCorrelation: true,
            };
          }

          // Если месяца ещё нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[monthKey] || !acc[monthKey]?.isCorrelation) {
            if (!acc[monthKey]) {
              acc[monthKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                month: itemDate.getMonth() + 1,
                isCorrelation: false,
              };
            }
            acc[monthKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (последний день месяца)
      const updatedMonthlyPoints = [];

      // Для каждого месяца от 14 месяцев назад до текущего добавляем данные
      for (let i = count; i < 13 + count; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthKey = `${monthDate.getFullYear()}-${
          monthDate.getMonth() + 1
        }`;

        // Если данных нет для этого месяца, создаем запись с суммой 0
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            valueSum: 0,
            year: monthDate.getFullYear(),
            month: monthDate.getMonth() + 1,
            isCorrelation: false,
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
          isCorrelation: monthlyData[monthKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего месяца к первому
      updatedMonthlyPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setPointsForGraphic(updatedMonthlyPoints);
    }

    if (typeGraphic === "Ежегодовой") {
      // Группируем данные по годам и суммируем `valueDate` за каждый год
      const yearData = data.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const yearKey = `${itemDate.getFullYear()}`;
        // Проверяем, что дата корректна и меньше чем на 13 лет от текущего года
        if (
          !isNaN(itemDate) &&
          new Date().getFullYear() - 12 < itemDate.getFullYear()
        ) {
          if (item?.isCorrelation === true) {
            acc[yearKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              isCorrelation: true,
            };
          }

          // Если года еще нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[yearKey] || !acc[yearKey]?.isCorrelation) {
            if (!acc[yearKey]) {
              acc[yearKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                isCorrelation: false,
              };
            }
            acc[yearKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (первый день года)
      const updatedYearPoints = [];

      // Для каждого года от 13 лет назад до текущего добавляем данные
      for (let i = count; i < 12 + count; i++) {
        const yearDate = new Date();
        yearDate.setFullYear(yearDate.getFullYear() - i);
        const yearKey = `${yearDate.getFullYear()}`;

        // Если данных нет для этого года, создаем запись с суммой 0
        if (!yearData[yearKey]) {
          yearData[yearKey] = {
            valueSum: 0,
            year: yearDate.getFullYear(),
            isCorrelation: false,
          };
        }

        updatedYearPoints.push({
          id: yearData[yearKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${yearDate.getFullYear()}-01-01`,
          value: yearData[yearKey].valueSum, // Сумма за год
          isCorrelation: yearData[yearKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего года к первому
      updatedYearPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setPointsForGraphic(updatedYearPoints);
    }
    if (typeGraphic === "13" || typeGraphic === "26" || typeGraphic === "52") {
      const today = new Date();
      today.setDate(today.getDate() - count * 7);
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
        currentSum = data
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            );
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setPointsForGraphic(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
  };

  useEffect(() => {
    updateStatisticsData();
  }, [count]);

  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <img
          src={exitModal}
          alt="exitModal"
          onClick={() => exit()}
          className={classes.exit}
        />

        <div className={classes.item_rowSVG}>
          <span>{name}</span>

          <div className={classes.row_svg_arrow}>
            <svg ref={svgRef}></svg>
            <div className={classes.blockArrrow}>
              <div className={classes.statisticsArrow}>
                <img
                  src={arrowLeft}
                  alt="arrowLeft"
                  onClick={handleArrowLeftClick}
                />
              </div>
              <div className={classes.statisticsArrow}>
                <img
                  src={arrowRight}
                  alt="arrowRight"
                  onClick={handleArrowRightClick}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={classes.item_rowBtns}>
          {buttonTypes.map((item) => (
            <button
              key={type}
              className={`${classes.btn} ${
                typeGraphic === item.type ? classes.btn_active : ""
              }`}
              onClick={() => handleTypeGraphicButtonClick(item.type)}
            >
              {item.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalStatistic;
