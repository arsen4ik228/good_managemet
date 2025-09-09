import React from 'react'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'

export default function Statistic() {


    const buutonsArr = [
        { text: 'Редактировать', click: () => window.open(window.location.origin + '/#/' + 'editStatistic', '_blank') }
        // { text: 'Поделиться', click: () => navigate('1') },
        // { text: 'Распечатать', click: () => navigate('1') },
    ]
    return (
        <MainContentContainer
            buttons={buutonsArr}
        >
            cn статисткики
        </MainContentContainer>
    )
}
