import React from 'react'
import classes from './CalendarModal.module.css'
import ModalContainer from '@Custom/ModalContainer/ModalContainer'

export default function CalendarModal({setOpenModal, dateStart, setDateStart, dateDeadline, setDateDeadline}) {
    return (
        <ModalContainer
            buttonText={'Сохранить'}
            setOpenModal={setOpenModal}
        >
            <div className={classes.Content}>
                <input className={classes.dateStart} type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)}/>
                <input className={classes.deadline} type="date" value={dateDeadline} onChange={(e) => setDateDeadline(e.target.value)}/>
            </div>
        </ModalContainer>
    )
}
