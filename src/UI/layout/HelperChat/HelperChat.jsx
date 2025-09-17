import React from 'react'
import classes from './HelperChat.module.css'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import zaglushak_chat from '@image/zaglushak_chat.svg'
import helper_medium from '@image/helper_medium.svg'

export default function HelperChat() {
    return (
        <>
            <MainContentContainer>
                <div className={classes.content}>
                    <div className={classes.textSection}>
                        <img src={helper_medium} alt="helper_medium" />
                        <div>
                            Привет! Я Гудменеджер
                        </div>
                        <div>
                            Чем могу быть полезен?
                        </div>
                    </div>
                    <div className={classes.inputTextSection}>
                        <img src={zaglushak_chat} alt="zaglushak_chat" />
                    </div>
                </div>
            </MainContentContainer>
        </>
    )
}
