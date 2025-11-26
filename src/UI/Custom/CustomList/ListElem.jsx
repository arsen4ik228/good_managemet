import React, { useEffect, useRef, useState } from 'react'
import classes from './ListElem.module.css'
import avatar from '@image/icon _ GM-large.svg'
import { useFindPathSegment } from '@helpers/helpers'
import { Tooltip } from 'antd'

export default function ListElem({ icon, upperText, bottomText, bage, greyBage, linkSegment, isActive, clickFunc, setSelectedItemData }) {
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
                <Tooltip
                    title={bottomText ? `${upperText} - ${bottomText}` : upperText}
                    mouseEnterDelay={0.3} // 1 секунда задержки
                    placement="right"
                    autoAdjustOverflow={true}
                    destroyTooltipOnHide={true}
                    overlayStyle={{ maxWidth: 400 }}
                >
                    <div
                        className={classes.text}
                    >
                        <div className={` ${classes.upperTxt}   ${isActive === false && classes.notActive}`}>{upperText}</div>
                        {bottomText && (
                            <div className={classes.bottomTxt}>{bottomText}</div>
                        )}
                    </div>
                </Tooltip>
                <div
                    className={classes.roundSection}
                >
                    {greyBage && !(Number(bage) > 0) ? (
                        <div
                        style={{
                            backgroundColor: 'grey'
                        }}
                        >
                            {/* {bage} */}
                        </div>
                    ) : (
                        <div
                            style={{
                                visibility: (Number(bage) > 0) ? 'visible' : 'hidden'
                            }}
                        >
                            {bage}
                        </div>
                    )}

                </div>
                {/* )} */}
            </div>
        </>
    )
}
