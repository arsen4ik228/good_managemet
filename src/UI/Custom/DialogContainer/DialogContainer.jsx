import React from 'react'
import classes from './DialogContainer.module.css'
import avatar from '@Custom/icon/icon _ GM.svg'
import { baseUrl } from '@helpers/constants'



export const DialogContainer = ({ postName, userName, avatarUrl, unseenMessagesCount, selectedContactId, contactId }) => {
    const localUnseenMessagesCount = (unseenMessagesCount !== 0 && unseenMessagesCount) && true
    return (
        <>
            <div className={`${classes.dialogContainer} ${contactId === selectedContactId ? classes.selectedContact : ''}`} >
                <div className={classes.content}>
                    <div className={classes.avatar}>
                        <img src={avatarUrl ? `${baseUrl}${avatarUrl}` : avatar} alt="avatar" />
                    </div>
                    <div className={classes.name}>
                        <div className={classes.postName}>{postName.toUpperCase()}</div>
                        <div className={classes.userName}>{userName}</div>
                    </div>

                    {localUnseenMessagesCount && (
                        <div className={classes.bage}>
                            <div>
                                <span>{unseenMessagesCount}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
