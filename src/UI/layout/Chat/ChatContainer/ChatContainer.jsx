import React from 'react'
import classes from './ChatContainer.module.css'
import InputMessage from '../Input/InputMessage.jsx'
import { usePanelPreset,useRightPanel } from '@hooks';

export default function ChatContainer({children, onCreate, onCalendar}) {

        const { PRESETS } = useRightPanel();
    
        usePanelPreset(PRESETS['CHATS']);

    return (
        <div className={classes.wrapper}>
            <div className={classes.content}>
                <div className={classes.messagesContainer}>
                    {children}
                </div>
                <div className={classes.inputContainer}>
                    <InputMessage onCreate={onCreate} onCalendar={onCalendar}></InputMessage>
                </div>
            </div>
        </div>
    )
}
