import React from 'react'
import classes from './ChatContainer.module.css'
import InputMessage from '../Input/InputMessage.jsx'

export default function ChatContainer({children}) {
    return (
        <div className={classes.wrapper}>
            <div className={classes.content}>
                <div className={classes.messagesContainer}>
                    {children}
                </div>
                <div className={classes.inputContainer}>
                    <InputMessage></InputMessage>
                </div>
            </div>
        </div>
    )
}
