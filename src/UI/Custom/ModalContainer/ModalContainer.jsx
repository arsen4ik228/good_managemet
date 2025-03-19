import React from 'react'
import classes from './ModalContainer.module.css'
import { ButtonContainer } from '../CustomButtomContainer/ButtonContainer'
import close from "../SearchModal/icon/icon _ add.svg";
import PropTypes from 'prop-types'; 



export default function ModalContainer({ children, buttonText, setOpenModal, clickFunction, disabledButton, style }) {

    const closeModal = () => {
        setOpenModal(false)
    }
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.contentContainer} style={style}>
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
                            {buttonText} 
                        </ButtonContainer>
                    </div>
                </div>
            </div>
        </>
    )
}


ModalContainer.propTypes = {
    children: PropTypes.node.isRequired, 
    buttonText: PropTypes.string, 
    setOpenModal: PropTypes.func.isRequired, 
    clickFunction: PropTypes.func,
    disabledButton: PropTypes.bool, 
    style: PropTypes.object, 
};


ModalContainer.defaultProps = {
    buttonText: 'Сохранить', 
    clickFunction: null, 
    disabledButton: false, 
    style: {}, 
};
