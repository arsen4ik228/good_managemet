import React, { useEffect } from 'react'
import classes from './ListElem.module.css'
import avatar from '@image/icon _ GM-large.svg'
import { useFindPathSegment } from '@helpers/helpers'

export default function ListElem({ icon, upperText, bottomText, bage, linkSegment, clickFunc, setSelectedItemData }) {
    const isSelected = useFindPathSegment(linkSegment)

    useEffect(() => {
        if (isSelected && setSelectedItemData) {
            setSelectedItemData({
                icon,
                upperText,
                bottomText,
                bage,
                linkSegment,
                clickFunc
            })
        }
    }, [isSelected])

    return (
        <>
            <div className={`${classes.content} ${isSelected && classes.selected}`} onClick={() => clickFunc()}>
                <div className={classes.imgContainer}>
                    <img src={icon ?? avatar} alt="avatar" />
                </div>
                <div className={classes.text}>
                    <div className={classes.upperTxt}>{upperText}</div>
                    {bottomText && (
                        <div className={classes.bottomTxt}>{bottomText}</div>
                    )}
                </div>
                {(Number(bage) > 0) && (
                    <div className={classes.roundSection}>
                        <div>{bage}</div>
                    </div>
                )}
            </div>
        </>
    )
}
