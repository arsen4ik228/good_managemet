import React from 'react'
import classes from './MessageSelectingList.module.css'
import avatar from '@image/helper_medium.svg'
import MainContentContainer from '../MainContentContainer/MainContentContainer'

export default function MessageSelectingList() {
  return (
    <MainContentContainer>
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <div className={classes.avatar}>
                    <img src={avatar} alt="avatar" />
                </div>
                <div className={classes.messageContainer}>
                    <div>Выберите нужный вам элемент, чтобы начать работать с разделом!</div>
                </div>
            </div>
        </div>
    </MainContentContainer>
  )
}
