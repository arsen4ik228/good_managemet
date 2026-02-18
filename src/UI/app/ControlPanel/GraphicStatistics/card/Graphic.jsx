import {useEffect, useRef} from "react";
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
    const shortYear = String(year % 100).padStart(2, "0");
    return `${day}.${month}.${shortYear}`;
};

// Функция для форматирования чисел с пробелами
const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function Graphic({data, type, norma}) {
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

        // Рассчитываем min, max и interval для 10 линий
        let yMin = 0;
        let yMax = 100;
        let yInterval = 10;

        if (data && data.length > 0) {
            const values = data
                .map((item) => item.value)
                .filter((val) => val !== null);

            if (values.length > 0) {
                yMin = Math.min(...values);
                yMax = Math.max(...values);

                // Если все значения одинаковые (например, одна точка)
                if (yMin === yMax) {
                    // Задаём диапазон в ±10% от значения (или фиксированный, если значение 0)
                    const padding = yMin === 0 ? 10 : Math.abs(yMin * 0.1);
                    yMin = yMin - padding;
                    yMax = yMax + padding;
                }

                // Дальше обычный расчёт интервала
                const rawInterval = (yMax - yMin) / 9;
                const exponent = Math.pow(10, Math.floor(Math.log10(rawInterval)));
                const roundedStep = exponent * Math.ceil(rawInterval / exponent);

                yMin = Math.floor(yMin / roundedStep) * roundedStep;
                yMax = Math.ceil(yMax / roundedStep) * roundedStep;
                yInterval = (yMax - yMin) / 9;
            }
        }

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
                borderWidth: 1,
                padding: [10, 15],
                textStyle: {
                    color: "#333",
                },
                extraCssText: "box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);",
            },
            grid: {
                top: 10, // Убираем отступ сверху
                right: 10, // Убираем отступ справа
                bottom: 10, // Убираем отступ снизу
                left: 10, // Убираем отступ слева
                containLabel: true, // Разрешаем меткам выходить за границы
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: chartData.map((item) => item.name),
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    // Линия оси X
                    show: true,
                    lineStyle: {
                        color: "#C0C0C0", // Цвет линии оси X
                        width: 1, // Толщина линии
                    },
                },
                axisTick: {
                    // Деления на оси X
                    show: false,
                    alignWithLabel: true,
                    interval: 0,
                },
                splitLine: {
                    // Линии сетки по оси X
                    show: true,
                    lineStyle: {
                        color: "#C0C0C0", // Цвет линий сетки
                        type: "solid", // Тип линии (пунктир)
                    },
                    interval: 0,
                },
            },
            yAxis: {
                type: "value",
                inverse: type === "Обратная",
                min: yMin, // Минимальное значение
                max: yMax, // Максимальное значение
                interval: yInterval, // Шаг между линиями

                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#C0C0C0",
                        width: 1,
                    },
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#C0C0C0",
                        type: "solid",
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
                    symbolSize: 10,
                    lineStyle: {
                        width: 3,
                        type: "solid", // Явно указываем сплошную линию
                    },

                    markPoint: {
                        show: false,
                    },
                    markLine: norma != null ? {
                        silent: false, // ← важно
                        symbol: "none",
                        lineStyle: {
                            color: "#333333",
                            type: "dashed",
                            width: 2,
                        },
                        label: {
                            show: true,
                            formatter: `Норма: ${norma}`,
                            color: "#333333",
                            position: "end",
                        },
                        tooltip: {
                            formatter: () => `Норма: ${norma}`,
                        },
                        data: [
                            {yAxis: norma},
                        ],
                    } : undefined,
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

    return (
        <div
            ref={chartRef}
            style={{
                width: "250px",
                height: "315px",
            }}
        />
    );
}
