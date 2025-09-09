import React from 'react'
import classes from './MainContentContainer.module.css'
import { Button } from 'antd'

export default function MainContentContainer({ component, buttons, children }) {
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.Header}>
          <div></div>
          <div>
            {buttons?.map((item, index) => (
              <Button key={index} onClick={item.click}>{item.text}</Button>
            ))}
            {component}
          </div>
        </div>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    </>
  )
}
