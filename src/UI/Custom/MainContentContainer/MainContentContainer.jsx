import React from 'react'
import classes from './MainContentContainer.module.css'

export default function MainContentContainer({children}) {
  return (
    <>
        <div className={classes.wrapper}>
            <div className={classes.Header}>
                <div></div>
                <div></div>
            </div>
            <div className={classes.content}>
                {children}
            </div>
        </div>
    </>
  )
}
