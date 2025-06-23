
import React, { useEffect, useRef } from 'react'
import classes from './CustomtextArea.module.css'

export default function CustomtextArea({ content, setContent, disabled }) {

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
  }, [])

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <textarea
            ref={textareaRef}
            name="customtextArea"
            value={content}
            onChange={(e) =>{
              setContent(e.target.value)
              adjustHeight()
            }}
          disabled={disabled}
          >
        </textarea>
      </div>
    </div >
    </>
  )
}
