import React from 'react'
import classes from './ModalContainer.module.css'
import { ButtonContainer } from '../CustomButtomContainer/ButtonContainer'
import close from "../SearchModal/icon/icon _ add.svg";


export default function ModalContainer({ children, buttonText, setOpenModal, clickFunction, disabledButton }) {

    const closeModal = () => {
        setOpenModal(false)
    }
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                    <div className={classes.contentColumn}>
                        <div className={classes.close}>
                            <img src={close} alt="close" onClick={() => setOpenModal(false)} />
                        </div>
                        <div className={classes.content}>
                            {children}
                        </div>
                        <ButtonContainer
                            clickFunction={clickFunction || closeModal}
                            disabled={disabledButton}
                        >
                            {buttonText ? buttonText : 'Сохранить'}
                        </ButtonContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
