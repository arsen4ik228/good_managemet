import { useState } from 'react'
import classes from './MainContentContainer.module.css'
import { Button } from 'antd'

export default function MainContentContainer({ component, buttons, children }) {
  const [count, setCount] = useState(0);

  const getVersion = () => {
    const buildDate = process.env.REACT_APP_BUILD_DATE;
    return buildDate ? `v.${buildDate}` : `v.${new Date().toLocaleDateString('ru-RU')}`;
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.Header} onClick={() => setCount(count + 1)}>
          <div>
            {
              count >= 5 && getVersion()
            }
          </div>
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
