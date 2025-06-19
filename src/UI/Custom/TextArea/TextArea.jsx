import React, { useEffect, useRef } from "react";
import classes from "./TextArea.module.css";

export default function TextArea({ value, onChange, readOnly }) {
  const textareaRef = useRef(null);

  // Функция для автоматического изменения высоты
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Сброс высоты
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Установка новой высоты
    }
  };

  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      className={`${classes.textArea} `} // ${readOnly ? classes.textColor : ""}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        adjustHeight();
      }} 
      disabled={readOnly}
    ></textarea>
  );
}
