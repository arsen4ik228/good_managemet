import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import classes from "./Graphic.module.css";
import { useWindowSize } from 'react-window-size';
import { getDateFormatSatatistic } from "../../../BLL/constans";

const Graphic = ({ data, name, setName, typeGraphic, type }) => {
  const svgRef = useRef();
  const [nameStatistics, setNameStatistics] = useState(name);

  const [width, setWidth] = useState(880);
  const [height, setHeight] = useState(400); // Начальное значение

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      const newHeight = windowHeight - 160;
      const newWidth = windowWidth + 40;

      console.log(newHeight)
      setWidth(newWidth)
      setHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Вызываем функцию один раз при монтировании компонента
    handleResize();

    // Очищаем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setNameStatistics(name);
  }, [name]);

  useEffect(() => {
    setName(nameStatistics);
  }, [nameStatistics]);

  // Обновляем ширину и высоту в зависимости от типа графика
  useEffect(() => {
    const updateDimensions = () => {

      if (typeGraphic !== "52" || !typeGraphic) {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        const newHeight = windowHeight - 160;
        const newWidth = windowWidth + 40;

        console.log(newHeight)
        setWidth(newWidth)
        setHeight(newHeight);
      }
      else {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        const newHeight = windowWidth + 25;
        const newWidth = windowHeight - 105;

        // console.log(newHeight)
        setWidth(newWidth)
        setHeight(newHeight);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [typeGraphic]);


  useEffect(() => {
    data.sort((a, b) => new Date(a.valueDate) - new Date(b.valueDate));

   

    const margin = { top: 40, right: 30, bottom: 80, left: 50 };

    const minValue = d3.min(data, (d) => d.value);
    const maxValue = d3.max(data, (d) => d.value);

    // Устанавливаем верхнюю границу оси Y с небольшим запасом
    const upperLimit = maxValue * 1.1;  // Увеличиваем максимальное значение на 10%

    const x = d3
      .scalePoint()
      .domain(
        data.map((d) =>
          d.valueDate === "" || d.valueDate === null
            ? "дата"
            : getDateFormatSatatistic(d.valueDate, typeGraphic)
        )
      )
      .range([margin.left, width - margin.right])
      .padding(0);
      

    // Если type === "Обратная", то ось Y будет инвертирована, а верхний предел будет больше
    const y = type === "Обратная"
    ? d3.scaleLinear()
        .domain([0, upperLimit]) // Начинаем с 0 для обратного типа
        .nice()
        .range([margin.top, height - margin.bottom])
    : d3.scaleLinear()
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

    const tickValues = data.map((d) =>
      d.valueDate === "" || d.valueDate === null
        ? "дата"
        : getDateFormatSatatistic(d.valueDate, typeGraphic)
    );

    // Получаем значения для горизонтальных линий сетки с использованием y.ticks()
    const yTickValues = y.ticks(5);  // Используем метод ticks() для точных значений

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
      .attr("stroke", "#4a4a4a")  // Темный цвет для сетки
      .attr("stroke-width", 1)
      .attr("opacity", 0.3);

    const xAxis = d3.axisBottom(x);

    svg
      .append("g")
      .attr("class", "x-axis")
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

    data.forEach((d, i) => {
      if (i > 0) {
        const prevValue = data[i - 1].value;
        // Reverse the line color logic based on the 'type' prop
        const color = type === "Обратная"
          ? (d.value < prevValue ? "blue" : "red") // Reverse logic for line color
          : (d.value < prevValue ? "red" : "blue"); // Normal logic for line color

        svg
          .append("path")
          .datum([data[i - 1], d])
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("d", line);
      }
    });

    const getColor = (value, index) => {
      if (index > 0) {
        const prevValue = data[index - 1].value;
        // Reverse the color logic for points as well
        return type === "Обратная"
          ? (value < prevValue ? "blue" : "red") // Reverse logic for points
          : (value < prevValue ? "red" : "blue"); // Normal logic for points
      } else {
        return "blue";
      }
    };

  //  if (typeGraphic !== '52') {
      svg
        .selectAll("circle")
        .data(data)
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
        .attr("fill", (d, i) => getColor(d.value, i))
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget).attr("r", 7).attr("fill", "orange");

          const tooltipX = x(
            d.valueDate === "" || d.valueDate === null
              ? "дата"
              : getDateFormatSatatistic(d.valueDate, typeGraphic)
          );
          const tooltipY = y(d.value) - 15;

          // Формируем текст для тултипа
          const dateText = `Дата: ${d.valueDate === "" || d.valueDate === null ? "дата" : getDateFormatSatatistic(d.valueDate, typeGraphic)}`;
          const valueText = `Значение: ${d.value}`;
          const textWidth = Math.max(dateText.length, valueText.length) * 6; // Оценочная ширина в пикселях

          // Ширина тултипа
          const tooltipWidth = Math.max(120, textWidth + 20);
          const tooltipHeight = 50;

          // Проверка на выход за границы
          const isTopOutOfBound = tooltipY - tooltipHeight < margin.top;
          const isRightOutOfBound = tooltipX + tooltipWidth / 2 > width - margin.right;
          const isLeftOutOfBound = tooltipX - tooltipWidth / 2 < margin.left;

          let adjustedX = tooltipX;
          if (isRightOutOfBound) adjustedX = width - margin.right - tooltipWidth / 2;
          else if (isLeftOutOfBound) adjustedX = margin.left + tooltipWidth / 2;

          const adjustedY = isTopOutOfBound ? tooltipY + tooltipHeight : tooltipY;

          // Получаем цвет точки
          const pointColor = getColor(d.value, data.indexOf(d));

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
          const index = data.indexOf(d);
          d3.select(event.currentTarget)
            .attr("r", 5)
            .attr("fill", getColor(d.value, index)); // Apply the reversed color logic here
          svg.select("#tooltip").remove();
        });
    //}
  }, [data, width, height, type]);

  return (
    <div
      className={classes.block}
      style={{ transform: typeGraphic === '52' ? 'rotate(90deg)' : 'none' }}
    >
      {/* <input
        type="text"
        value={nameStatistics}
        onChange={(e) => setNameStatistics(e.target.value)}
        className={classes.row1}
      /> */}
      <svg ref={svgRef} className={classes.row2}></svg>
    </div>
  );
};

export default Graphic;