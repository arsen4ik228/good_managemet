import React from 'react'
import classes from './MainContentContainer.module.css'
import { Button } from 'antd'

export default function MainContentContainer({ component, buttons, children }) {

  const getVersion = () => {
    const buildDate = process.env.REACT_APP_BUILD_DATE;
    return buildDate ? `v.${buildDate}` : `v.${new Date().toLocaleDateString('ru-RU')}`;
}

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.Header}>
          <div>{getVersion()}</div>
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
