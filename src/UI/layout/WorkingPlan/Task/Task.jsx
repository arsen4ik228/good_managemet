import React from 'react'
import classes from './Task.module.css'
import delegate_icon from '@image/delegate_icon.svg'
import round_check_icon from '@image/round_check_icon.svg'
import round_check_complete_icon from '@image/round_check_complete_icon.svg'
import { Tooltip } from 'antd'
import { formatDateWithDay } from '@helpers/helpers.js'

export default function Task({ content, deadline }) {
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.leftContainer}>
                    <img src={round_check_icon} alt="round_check_icon" />
                </div>
                <div className={classes.rightContainer}>
                    <div className={classes.infoContainer}>
                        <div className={classes.taskType}>Приказ</div>
                        <div className={classes.date}>Завершить: {formatDateWithDay(deadline)}</div>
                    </div>
                    <div className={classes.contentContainer}>
                        <Tooltip
                            title={content}
                            mouseEnterDelay={0.6} // 1 секунда задержки
                            placement="right"
                            autoAdjustOverflow={true}
                            destroyTooltipOnHide={true}
                            overlayStyle={{ maxWidth: 400 }}
                        >
                            <div className={classes.textContainer}>
                                {content}
                            </div>
                        </Tooltip>
                        <div className={classes.delegateContainer}>
                            <img src={delegate_icon} alt="delegate_icon" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
