import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// Функция для определения формата даты
const detectDateFormat = (dateString) => {
  if (!dateString) return "year";

  if (typeof dateString === "object") {
    return dateString.month ? "year-month" : "year";
  }

  if (typeof dateString === "number") {
    return "year";
  }

  const parts = dateString.split("-");
  if (parts.length === 1) return "year";
  if (parts.length === 2) return "year-month";
  return "full";
};

// Форматирование даты
const formatDate = (dateValue) => {
  const formatType = detectDateFormat(dateValue);

  if (typeof dateValue === "object") {
    if (dateValue.month) {
      return `${String(dateValue.month).padStart(2, "0")}.${dateValue.year}`;
    }
    return dateValue.year.toString();
  }

  if (formatType === "year") {
    return typeof dateValue === "number" ? dateValue.toString() : dateValue;
  }

  if (formatType === "year-month") {
    const [year, month] = dateValue.split("-");
    return `${month.padStart(2, "0")}.${year}`;
  }

  const date = new Date(dateValue);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Функция для форматирования чисел с пробелами
const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function Graphic({ data, widthObj, isSmallPoint, type = "Прямая" }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Сортировка данных
    const sortedData = [...data].sort(
      (a, b) => Date.parse(a.valueDate) - Date.parse(b.valueDate)
    );

    const chartData = sortedData.map((item, index) => {
      let isLowerThanPrevious = false;

      // Преобразуем value в число для сравнения
      const currentValue = item.value !== null ? Number(item.value) : null;
      const previousValue =
        index > 0 && sortedData[index - 1].value !== null
          ? Number(sortedData[index - 1].value)
          : null;

      // Проверяем только если есть предыдущее значение и оба значения не null
      if (index > 0 && currentValue !== null && previousValue !== null) {
        isLowerThanPrevious = currentValue < previousValue;
      }

      // Определяем цвета в зависимости от типа
      let color;
      if (type === "Обратная") {
        color = isLowerThanPrevious ? "#3E7B94" : "#ff4d4f";
      } else {
        color = isLowerThanPrevious ? "#ff4d4f" : "#3E7B94";
      }

      return {
        name: formatDate(item.valueDate),
        value: currentValue, // сохраняем как число
        formattedValue:
          currentValue !== null ? formatNumber(currentValue) : null,
        date: item.valueDate,
        itemStyle: {
          color: color,
        },
      };
    });

    // Настройки графика
    const option = {
      animation: false,
      grid: {
        top: 10,    // отступ сверху
        bottom: 5, // отступ снизу
        left: 20,   // оставляем немного для подписей оси Y
        right: 10,
        containLabel: true, // чтобы подписи осей не обрезались
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `
            <div>
              <div>Дата: ${params?.data?.name}</div>
              <div>Значение: ${params?.data?.formattedValue}</div>
            </div>
          `;
        },
        backgroundColor: "#fff",
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: "#333",
        },
        extraCssText: "box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);",
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartData.map((item) => item.name),
        axisLabel: {
          rotate: 90,
          ...(
            isSmallPoint
              ? { interval: 0, fontSize: 8 }  
              : {}                             
          )
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#999",
            width: 1,
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#eee",
            type: "dashed",
          },
        },
      },

      yAxis: {
        type: "value",
        inverse: type === "Обратная", // Переворачиваем ось Y только для обратного типа
        axisLabel: {
          formatter: function (value) {
            if (value >= 1000000) return value / 1000000 + "M";
            if (value >= 1000) return value / 1000 + "т";
            return value;
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#999",
            width: 1,
          },
        },
        axisTick: {
          show: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#eee",
            type: "dashed",
          },
        },
      },

      visualMap: {
        show: false,
        dimension: 0,
        pieces: (() => {
          const pieces = [];
          for (let i = 1; i < chartData.length; i++) {
            let color;
            if (type === "Обратная") {
              color = chartData[i].value < chartData[i - 1].value ? "#3E7B94" : "#ff4d4f";
            } else {
              color = chartData[i].value < chartData[i - 1].value ? "#ff4d4f" : "#3E7B94";
            }

            pieces.push({
              gt: i - 1,
              lte: i,
              color: color,
            });
          }
          return pieces;
        })(),
      },

      series: [
        {
          name: "Значение",
          type: "line",
          data: chartData,
          symbol: "circle",

          ...(
            isSmallPoint
              ? { symbolSize: 8, lineStyle: { width: 2, type: "solid" } }
              : { symbolSize: 10, lineStyle: { width: 3, type: "solid" } }
          ),

          markPoint: {
            show: false,
          },
        },
      ],
    };

    const chart = echarts.init(chartRef.current);
    chart.setOption(option);

    // Обработка изменения размера окна
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data, type]);

  return <div ref={chartRef} style={{ ...widthObj }} />;
}