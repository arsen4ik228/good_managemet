import React from 'react'
import classes from './ListAddButton.module.css'
import add from '@image/big_plus.svg'

export default function ListAddButtom({textButton, clickFunc}) {
  return (
    <>
        <div className={classes.content} onClick={clickFunc}>
            <div className={classes.imgContainer}>
                <img src={add} alt="add" />
            </div>
            <div className={classes.text}>{textButton}</div>
        </div>
    </>
  )
}
