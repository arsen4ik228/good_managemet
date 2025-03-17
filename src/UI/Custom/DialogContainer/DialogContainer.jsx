import React from 'react'
import classes from './DialogContainer.module.css'
import avatar from '@Custom/icon/icon _ GM.svg'
import { baseUrl } from '@helpers/constants'
import { isMobile } from 'react-device-detect'

export const DialogContainer = ({ elem }) => {
    // console.log(elem)
    return (
        <>
            <div className={classes.dialogContainer} style={{'backgroundColor': !isMobile ? 'white' : 'none'}}>
                <div className={classes.content}>
                    <div className={classes.avatar}>
                        <img src={elem?.avatar_url ? `${baseUrl}${elem?.avatar_url}` : avatar} alt="avatar" />
                    </div>
                    <div className={classes.name}>
                        <div className={classes.postName}>{elem?.postName.toUpperCase()}</div>
                        <div className={classes.userName}>{elem?.employee}</div>
                    </div>
                    <div className={classes.bage}>
                        <div>
                            <span>{elem?.unseenMessagesCount > 99 ? '99' : elem?.unseenMessagesCount}</span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
