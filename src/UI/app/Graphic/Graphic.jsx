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

export default function Graphic({ data, width }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Сортировка данных
    const sortedData = [...data].sort((a, b) => {
      const dateA =
        typeof a.valueDate === "object"
          ? new Date(a.valueDate.year, a.valueDate.month || 0)
          : new Date(a.valueDate);
      const dateB =
        typeof b.valueDate === "object"
          ? new Date(b.valueDate.year, b.valueDate.month || 0)
          : new Date(b.valueDate);
      return dateA - dateB;
    });

    // Подготовка данных
    const chartData = sortedData.map((item, index) => {
      const isLowerThanPrevious =
        index > 0 && item.value < sortedData[index - 1].value;
      return {
        name: formatDate(item.valueDate),
        value: item.value,
        formattedValue: item.value !== null ? formatNumber(item.value) : null,
        date: item.valueDate,
        itemStyle: {
          color: isLowerThanPrevious ? "#ff4d4f" : "#3E7B94",
        },
      };
    });

    // Настройки графика
    const option = {
      animation: false,
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
        borderColor: "#ddd",
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
        },
        axisLine: {
          // Линия оси X
          show: true,
          lineStyle: {
            color: "#999", // Цвет линии оси X
            width: 1, // Толщина линии
          },
        },
        axisTick: {
          // Деления на оси X
          show: true,
          alignWithLabel: true,
        },
        splitLine: {
          // Линии сетки по оси X
          show: true,
          lineStyle: {
            color: "#eee", // Цвет линий сетки
            type: "dashed", // Тип линии (пунктир)
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}",
        },
        axisLine: {
          // Линия оси Y
          show: true,
          lineStyle: {
            color: "#999", // Цвет линии оси Y
            width: 1, // Толщина линии
          },
        },
        axisTick: {
          // Деления на оси Y
          show: true,
        },
        splitLine: {
          // Линии сетки по оси Y
          show: true,
          lineStyle: {
            color: "#eee", // Цвет линий сетки
            type: "dashed", // Тип линии (пунктир)
          },
        },
      },

      visualMap: {
        show: false,
        dimension: 0,
        pieces: (() => {
          const pieces = [];
          for (let i = 1; i < chartData.length; i++) {
            pieces.push({
              gt: i - 1,
              lte: i,
              color:
                chartData[i].value < chartData[i - 1].value
                  ? "#ff4d4f"
                  : "#3E7B94",
              // : "#1890ff",
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
          symbolSize: 10,
          lineStyle: {
            width: 3,
            type: "solid", // Явно указываем сплошную линию
          },
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
  }, [data]);

  return <div ref={chartRef} style={{ width: width, height: "90%" }} />;
}
