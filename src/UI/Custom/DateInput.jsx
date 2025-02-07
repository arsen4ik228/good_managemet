import React, { useState } from "react";
import classes from "../app/StatisticsPage/StatisticsContent.module.css";

export default function DateInput ({ item, index, onChangePoints }) {
  // Функция для отображения даты с обрезанным годом
  const formatDisplayDate = (date) => {
    const d = new Date(date);
    if (!isNaN(d)) {
      return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)}`;
    }
    return "";
  };

  // Храним значение в состоянии для динамического изменения
  const [formattedDate, setFormattedDate] = useState(formatDisplayDate(item.valueDate));

  const handleChange = (e) => {
    const value = e.target.value;
    setFormattedDate(formatDisplayDate(value)); // Обновляем форматированную дату для отображения
    onChangePoints("received", value, "valueDate", index); // Вызываем переданную функцию
  };

  return (
    <input
      type="date"
      value={formattedDate} // Используем отформатированное значение
      onChange={handleChange}
      className={classes.date}
    />
  );
};
