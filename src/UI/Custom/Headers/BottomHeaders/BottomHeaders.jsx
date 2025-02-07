import React from 'react'
import classes from "./BottomHeaders.module.css"
import ButtonAction from './ButtonAction/ButtonAction'

export default function BottomHeaders({children, create, update}) {
  return (
    <div className={classes.editText}>
        {children}
        <ButtonAction create={create} update={update}></ButtonAction>
    </div>
  )
}
