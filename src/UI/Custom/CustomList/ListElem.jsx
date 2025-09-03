import React from 'react'
import classes from './ListElem.module.css'
import avatar from '@image/icon _ GM-large.svg'

export default function ListElem({ icon, upperText, bottomText, bage }) {
    return (
        <>
            <div className={classes.content}>
                <div className={classes.imgContainer}>
                    <img src={icon ?? avatar} alt="avatar" />
                </div>
                <div className={classes.text}>
                    <div className={classes.upperTxt}>{upperText}</div>
                    {bottomText && (
                        <div className={classes.bottomTxt}>{bottomText}</div>
                    )}
                </div>
                {bage && (
                    <div className={classes.roundSection}>
                        <div>
                            99+
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
