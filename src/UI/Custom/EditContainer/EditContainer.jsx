import React from 'react'
import classes from './EditContainer.module.css'
import { Button } from 'antd'

export default function EditContainer({ header, saveClick, canselClick, exitClick, children, aditionalbtns }) {
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.Header}>
          <div></div>
          <div>{header}</div>
        </div>
        <div className={classes.content}>
          {children}
        </div>
        <footer className={classes.footer}>
          <Button type='outlined' onClick={saveClick}>Сохранить</Button>
          <Button type='outlined' onClick={canselClick}>Отмена</Button>
          <Button type='outlined' onClick={exitClick}>Выйти</Button>
          {aditionalbtns.map((item) => (
            <Button
              key={item.name}
              type="outlined"
              style={{ color: item.colorBtn }}
              onClick={item.onClick}
            >
              {item.name}
            </Button>
          ))}

        </footer>
      </div>
    </>
  )
}
