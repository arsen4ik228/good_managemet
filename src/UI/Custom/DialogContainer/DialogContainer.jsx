import React from 'react'
import classes from './DialogContainer.module.css'
import { useConvertsHook } from '../../../hooks/useConvertsHook'

export const DialogContainer = () => {

    const {allConverts} = useConvertsHook()
    console.log(allConverts)
  return (
    <>  
        <div className={classes.dialogContainer}>
            <div className={classes.content}>
                <div className={classes.avatar}></div>
                <div className={classes.name}></div>
                <div className={classes.bage}></div>
            </div>
        </div>
    </>
  )
}
