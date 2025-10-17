import React from 'react'
import classes from './MessageSelectingList.module.css'
import avatar from '@image/helper_medium.svg'
import MainContentContainer from '../MainContentContainer/MainContentContainer'
import { usePanelPreset } from '@hooks';
import { useRightPanel } from '../../../hooks';
import GM from "@image/labelGM.svg"


export default function MessageSelectingList({ presetName }) {

    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS[presetName]);

    return (
        <MainContentContainer>
            <div className={classes.wrapper}>
                {/* <div className={classes.container}>
                <div className={classes.avatar}>
                    <img src={avatar} alt="avatar" />
                </div>
                <div className={classes.messageContainer}>
                    <div>Выберите нужный вам элемент, чтобы начать работать с разделом!</div>
                    <div className={classes.arrow}></div>
                </div>
            </div> */}

                <div className={classes.firstContainer}>
                    <img src={GM} alt="GM" />
                    <div className={classes.title}>GOODMANAGEMENT</div>
                    <div className={classes.loader}>
                        <div className={classes.line}></div>
                    </div>
                </div>
            </div>
        </MainContentContainer>
    )
}
